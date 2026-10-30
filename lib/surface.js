import path from "node:path";
import fs from "node:fs";

/** 当前已接线的宿主面。gui / tui 先能识别，适配仍回退 web。 */
export const SURFACES = Object.freeze(["web", "desktop", "gui", "tui"]);

function norm(value) {
  return String(value || "").trim().toLowerCase();
}

function slash(value) {
  return String(value || "").replace(/\\/g, "/").toLowerCase();
}

function exeName(execPath) {
  return path.basename(String(execPath || "")).toLowerCase();
}

export function pathLooksDesktop(p) {
  const n = slash(p);
  if (!n) return false;
  // 安装目录可能叫 "DeepSeek Harness" / "deepseek-harness" / "DeepseekHarnessDesktop"。
  // 源码仓库也常带 deepseek-harness 名字，所以还要带 resources/、exe、.app/ 才算桌面安装。
  const harnessDir =
    n.includes("/deepseek harness/") ||
    n.includes("/deepseek-harness/") ||
    n.includes("/deepseekharness") ||
    /\/deepseek[\s._-]*harness/.test(n);
  return (
    n.includes("/dsh desktop/") ||
    n.includes("/dsh desktop.app/") ||
    n.includes("dsh-desktop") ||
    n.includes("dsh-plugin-desktop") ||
    n.includes("dsh-desktop-next") ||
    n.includes("/dsh next/") ||
    n.includes("/dsh next.app/") ||
    n.includes("dsh-next") ||
    n.includes("/deepseek bot/") ||
    n.includes("/deepseek-bot/") ||
    n.includes("/ds-bot/") ||
    n.includes("/deepseek harness.app/") ||
    (harnessDir && (n.includes("/resources/") || n.includes("/contents/resources/") || n.endsWith("/resources"))) ||
    /\/dsh desktop\.exe$/i.test(n) ||
    /\/dsh next\.exe$/i.test(n) ||
    /\/deepseek[\s._-]*harness\.exe$/i.test(n) ||
    n.endsWith("/host-process-entry.js") ||
    n.endsWith("/desktop-cli.js")
  );
}

function resourcesLookLikeDesktopInstall(resourcesPath) {
  if (!resourcesPath) return false;
  if (pathLooksDesktop(resourcesPath)) return true;
  const n = slash(resourcesPath);
  if (!(n.endsWith("/resources") || n.includes("/contents/resources"))) return false;
  try {
    const asar = path.join(resourcesPath, "app.asar");
    if (fs.existsSync(asar) && fs.statSync(asar).isFile()) return true;
    if (fs.existsSync(path.join(resourcesPath, "app", "dsh"))) return true;
    if (fs.existsSync(path.join(resourcesPath, "app.asar.unpacked", "dsh"))) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** 社区 Electron（DS Bot / DeepSeek Bot）：profile 常是 ds-bot，DSH_SURFACE 还可能被写成 web。 */
export function isCommunityElectronHost(input = {}) {
  const env = input.env ?? process.env;
  const profile = norm(env.DSH_PROFILE);
  if (profile === "ds-bot" || profile === "dsbot" || profile === "deepseek-bot") return true;
  if (profile === "dsh-next" || profile === "dshnext" || profile === "dsh next") return true;
  const execPath = input.execPath ?? process.execPath;
  const name = exeName(execPath);
  if (/^deepseek[\s._-]*bot(\.exe)?$/.test(name) || /^ds[\s._-]*bot(\.exe)?$/.test(name)) return true;
  if (/^dsh[\s._-]*next(\.exe)?$/.test(name)) return true;
  const p = slash(execPath);
  if (p.includes("/deepseek bot") || p.includes("/deepseek-bot") || p.includes("/ds-bot/") || p.endsWith("/ds-bot")) return true;
  if (p.includes("/dsh next") || p.includes("/dsh-next")) return true;
  const resourcesPath = input.resourcesPath ?? process.resourcesPath;
  const electron = (input.versions ?? process.versions)?.electron;
  if (electron && resourcesLookLikeDesktopInstall(resourcesPath)) return true;
  return false;
}

export function isDesktopSurface(input = {}) {
  const env = input.env ?? process.env;
  if (isCommunityElectronHost(input)) return true;
  const forced = norm(env.DSH_SURFACE);
  if (forced === "desktop") return true;
  if (forced && SURFACES.includes(forced)) return false;

  const execPath = input.execPath ?? process.execPath;
  const name = exeName(execPath);
  if (
    name === "dsh desktop.exe" ||
    name === "dsh desktop" ||
    name === "dsh next.exe" ||
    name === "dsh next" ||
    name === "deepseek harness.exe" ||
    name === "deepseek-harness.exe" ||
    name === "deepseek harness" ||
    name === "deepseek-harness" ||
    /^deepseek[\s._-]*harness(\.exe)?$/.test(name) ||
    /^dsh[\s._-]*next(\.exe)?$/.test(name)
  ) return true;
  if (pathLooksDesktop(execPath)) return true;

  const resourcesPath = input.resourcesPath ?? process.resourcesPath;
  if (resourcesLookLikeDesktopInstall(resourcesPath)) return true;

  const argv = input.argv ?? process.argv;
  if ((Array.isArray(argv) ? argv : []).some((arg) => pathLooksDesktop(arg))) return true;

  const parentPort = input.parentPort !== undefined ? input.parentPort : process.parentPort;
  if (parentPort && (pathLooksDesktop(execPath) || resourcesLookLikeDesktopInstall(resourcesPath))) return true;

  if (env.ELECTRON_RUN_AS_NODE && (pathLooksDesktop(execPath) || resourcesLookLikeDesktopInstall(resourcesPath))) return true;
  return false;
}

function forcedSurface(env) {
  const forced = norm(env.DSH_SURFACE);
  return SURFACES.includes(forced) ? forced : "";
}

export function detectSurface(input = {}) {
  const env = input.env ?? process.env;
  if (isCommunityElectronHost(input)) return "desktop";
  const forced = forcedSurface(env);
  if (forced) return forced;
  if (isDesktopSurface(input)) return "desktop";
  return "web";
}

/** gui / tui 尚未单独适配，先走 web 重启与探测。 */
export function adapterFor(kind) {
  return kind === "desktop" ? "desktop" : "web";
}

/**
 * Android 宿主（官方 DSH 安卓包 / Termux 内嵌引擎）。
 * 判据只有三条，任一条命中即算：Node 直接报 android、PREFIX 落在 Termux 前缀、
 * 或显式 DSH_ANDROID=1。不做文件系统探测，避免桌面端误判。
 */
export function isAndroidHost(input = {}) {
  const env = input.env ?? process.env;
  const flag = norm(env.DSH_ANDROID);
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  const platform = String(input.platform ?? process.platform ?? "");
  if (platform === "android" || platform === "linux-android") return true;
  const prefix = slash(input.prefix ?? env.PREFIX ?? "");
  return prefix.includes("com.termux") || prefix.includes("/files/usr");
}

/**
 * dsh shim（PATH 上的 dsh / dsh.cmd / dsh.ps1）是否适用于当前宿主。
 * Android 没有这些启动器：入口是引擎里的 @deepseek-ai/dsh/lib/bin.js，
 * 所以 shim 相关的探测与写入一律按「不适用」结算，不再报未定位。
 */
export function shimApplicable(input = {}) {
  if (isAndroidHost(input)) return false;
  return true;
}
