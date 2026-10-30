import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLIENT = fs.readFileSync(path.join(ROOT, "client.js"), "utf8");
const DRILL_SRC = fs.readFileSync(path.join(ROOT, "lib", "redteam", "client.js"), "utf8");

/** 与 client.js 里 dockMinSize 保持同一套公式的镜像，用来钉住边界行为。 */
function minSize(vw, vh) {
  return {
    minW: Math.max(240, Math.min(380, vw - 16)),
    minH: Math.max(200, Math.min(320, vh - 16)),
  };
}

test("移动端样式块存在：safe-area + 100dvh + 触控目标", () => {
  assert.match(CLIENT, /\[dsh-purge\] mobile: safe-area/);
  assert.ok(CLIENT.includes("env(safe-area-inset-bottom"), "启动按钮要避让手势条");
  assert.ok(CLIENT.includes("calc(100dvh - 8px)"), "悬浮窗高度不能超出动态视口");
  assert.ok(CLIENT.includes(".dshp-dock-head{min-height:44px"), "拖动条触控高度 >= 44px");
  assert.ok(CLIENT.includes(".rt-dock{max-width:calc(100vw - 8px)"), "演练台同样受视口约束");
});

test("悬浮窗拖动/缩放全部走 Pointer Events，无 mouse-only 残留", () => {
  assert.equal(/onMouseDown:\s*start/.test(CLIENT), false, "不允许再绑 mouse 拖动");
  assert.ok(CLIENT.includes("const trackDockPointer = (e, move) =>"));
  assert.ok(CLIENT.includes('window.addEventListener("pointermove", move, { passive: false })'));
  assert.ok(CLIENT.includes('window.addEventListener("pointercancel", stop)'));
  assert.ok(CLIENT.includes("setPointerCapture"), "捕获指针，手指滑出面板也不断");
  // dock 头部 + 4 个手柄
  assert.ok(CLIENT.includes('className: "dshp-dock-head", onPointerDown: startDrag'));
  for (const cls of ["resize-l", "resize-r", "resize-b"]) {
    assert.ok(CLIENT.includes(`className: "dshp-dock-${cls}"`), `缺手柄 ${cls}`);
  }
  assert.ok(CLIENT.includes('className: "dshp-dock-resize"'), "缺右下手柄");
});

test("演练台源码与产物同步：build 不会把 pointer 改动冲掉", () => {
  assert.ok(DRILL_SRC.includes("addEventListener('pointermove', move, { passive: false })"));
  assert.ok(DRILL_SRC.includes("onPointerDown: (full || embedded) ? undefined : startDrag"));
  assert.equal(/onMouseDown:\s*start/.test(DRILL_SRC), false);
  // 产物里 DRILL 段确实来自源码
  assert.ok(CLIENT.includes("addEventListener('pointercancel', stop)"));
});

test("几何下限跟随视口：360dp 手机不再被 380 撑破", () => {
  assert.ok(CLIENT.includes("Math.max(240, Math.min(380, vw - 16))"));
  assert.ok(CLIENT.includes("Math.max(200, Math.min(320, vh - 16))"));

  const phone = minSize(360, 640);
  assert.equal(phone.minW, 344, "360dp 屏下限必须是 344，等于 vw-16");
  assert.equal(phone.minH, 320);

  const tablet = minSize(412, 915);
  assert.equal(tablet.minW, 380, "412dp 起维持原来的 380 下限");
  assert.equal(tablet.minH, 320);

  const desktop = minSize(1280, 800);
  assert.equal(desktop.minW, 380, "桌面行为不变");
  assert.equal(desktop.minH, 320);

  // 极窄屏（分屏/小窗）不能出现负数：宽取 240 地板，高跟着 vh-16 走
  const tiny = minSize(200, 300);
  assert.equal(tiny.minW, 240);
  assert.equal(tiny.minH, 284);
});

test("窄屏默认几何：贴顶、底部只留 8px", () => {
  assert.ok(CLIENT.includes("const y = narrow ? 8 : 48;"));
  assert.ok(CLIENT.includes("const bottomClear = narrow ? 8 : DOCK_COMPOSER_CLEAR;"));
  assert.ok(CLIENT.includes("const DOCK_PHONE_BP = 560;"));
});

test("dock v2 视觉层存在，且排在 !important 主题层之后", () => {
  const v2 = CLIENT.indexOf("dock v2 — 悬浮窗视觉重设计");
  assert.ok(v2 > 0, "缺 v2 视觉层");
  const themeLayer = CLIENT.indexOf('.dshp-dock[data-theme="dusk"]{background:');
  assert.ok(themeLayer > 0 && v2 > themeLayer, "v2 必须在主题强制层之后才生效");
  // 外壳靠同等特异性 + !important 压过主题层
  assert.ok(CLIENT.includes('.dshp-dock[data-theme="white"],.dshp-dock[data-theme="dusk"]{border-radius:18px'));
  // 分段式 tab：不再是下划线
  assert.ok(CLIENT.includes(".dshp-dock .dshp-dock-tab.on{background:"));
  assert.ok(CLIENT.includes("border-bottom-color:transparent!important"));
  // 状态指示灯与胶囊按钮
  assert.ok(CLIENT.includes('.dshp-dock .dshp-dock-head b::before{content:""'));
  assert.ok(CLIENT.includes(".dshp-launch::before{content:\"\""));
  assert.ok(CLIENT.includes("@keyframes dshp-dock-in"));
});
