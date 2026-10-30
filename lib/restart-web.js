import net from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { envForDetachedSpawn } from "./core.js";
import { isAndroidHost } from "./surface.js";

function isAndroid() {
  try {
    return isAndroidHost();
  } catch {
    return process.platform === "android";
  }
}

const encoded = process.env.DSH_PURGE_RESTART;
if (!encoded) process.exit(1);

let info;
try {
  info = JSON.parse(encoded);
} catch {
  process.exit(1);
}

const port = Number(info.port) || 3080;
const host = typeof info.host === "string" && info.host ? info.host : "127.0.0.1";

function portFree() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port }, () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => resolve(true));
  });
}

function killOldServer() {
  const pid = Number(info.pid);
  if (!pid || pid === process.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/F"], { windowsHide: true, stdio: "ignore" });
    return;
  }
  try { process.kill(pid, "SIGTERM"); } catch { /* already gone */ }
}

function openBrowser(url) {
  if (!url) return;
  if (process.platform === "win32") {
    spawn("cmd.exe", ["/d", "/s", "/c", "start", "", url], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    }).unref();
    return;
  }
  // Android：xdg-open 是 Termux 封装，缺 termux-api 时会静默失败；直接走 am。
  if (isAndroid()) {
    const tries = [
      ["/system/bin/am", ["start", "-a", "android.intent.action.VIEW", "-d", url]],
      ["am", ["start", "-a", "android.intent.action.VIEW", "-d", url]],
      ["termux-open", [url]],
    ];
    for (const [cmd, args] of tries) {
      try {
        const child = spawn(cmd, args, { detached: true, stdio: "ignore" });
        child.on("error", () => {});
        child.unref();
        return;
      } catch {
        /* 试下一个 */
      }
    }
    return;
  }
  const opener = process.platform === "darwin" ? "open" : "xdg-open";
  spawn(opener, [url], { detached: true, stdio: "ignore" }).unref();
}

async function waitFree() {
  for (let i = 0; i < 40; i++) {
    if (await portFree()) return true;
    if (i === 8) killOldServer();
    await new Promise((r) => setTimeout(r, 120));
  }
  killOldServer();
  for (let i = 0; i < 40; i++) {
    if (await portFree()) return true;
    await new Promise((r) => setTimeout(r, 120));
  }
  return false;
}

const ok = await waitFree();
if (!ok) process.exit(1);

// 接着 stdout 里的新地址打开浏览器。旧页面的 token 在新进程里无效，只刷新会打不开。
let opened = false;
const child = spawn(info.execPath, info.argv, {
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
  cwd: info.cwd || process.cwd(),
  env: envForDetachedSpawn(),
  windowsHide: true,
  shell: false,
});
child.on("error", () => process.exit(1));
const wantBrowser = info.openBrowser !== false;
const takeUrl = (chunk) => {
  const text = String(chunk || "");
  if (opened) return;
  const match = text.match(/dsh web:\s+(https?:\/\/\S+)/);
  if (!match) return;
  opened = true;
  if (!wantBrowser) return;
  const url = match[1].replace(/[),.;]+$/, "");
  openBrowser(url);
};
child.stdout?.on("data", takeUrl);
child.stderr?.on("data", takeUrl);
child.unref();
if (wantBrowser) {
  const started = Date.now();
  while (!opened && Date.now() - started < 20000) {
    await new Promise((r) => setTimeout(r, 200));
  }
} else {
  // 等子进程真正起来再退出，避免端口未监听时父链误判失败又拉一把。
  await new Promise((r) => setTimeout(r, 1500));
}
process.exit(0);
