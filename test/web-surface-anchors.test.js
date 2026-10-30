import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_PATCHES, applyReplacementsToText } from "../lib/core.js";

const NEW_SURFACE = [
  "const WEB_SURFACE_PROMPT = `You are interacting with the user through the DeepSeek Harness Web GUI whose URL the runtime context names. The browser provides no implicit DOM. Do not start a replacement server unless the user asks; if one is needed, use a managed background job and verify its exact URL.`;",
].join("\n");

const LEGACY_SURFACE = [
  "const prompt = (webUrl) => `You are interacting with the user through the DeepSeek Harness Web GUI at ${webUrl}.`;",
].join("\n");

function patch(id) {
  const p = ALL_PATCHES.find((x) => x.id === id);
  assert.ok(p, `#${id} 应在补丁表里`);
  return p;
}

test("#32 / #53 覆盖 0.2.1-rc.2 的 dsh-harness-dev-context", () => {
  assert.ok(patch(32).file.includes("dev-context"));
  assert.ok(patch(53).file.includes("dev-context"));
});

test("#32 把新版产品名换成 local web GUI", () => {
  const out = applyReplacementsToText(NEW_SURFACE, patch(32), "dev-context.js").text;
  assert.ok(out.includes("through the local web GUI whose URL the runtime context names."));
  assert.ok(!out.includes("DeepSeek Harness Web GUI"));
});

test("#53 收掉新版身份句并摘掉禁止另开服务器", () => {
  let text = applyReplacementsToText(NEW_SURFACE, patch(32), "dev-context.js").text;
  text = applyReplacementsToText(text, patch(53), "dev-context.js").text;
  assert.ok(text.includes("Local web GUI: URL named in the runtime context."));
  assert.ok(!text.includes("Do not start a replacement server unless the user asks"));
});

test("#53 单独跑（#32 未命中）也能收掉新版身份句", () => {
  const out = applyReplacementsToText(NEW_SURFACE, patch(53), "dev-context.js").text;
  assert.ok(out.includes("Local web GUI: URL named in the runtime context."));
});

test("旧版 ${webUrl} 文案仍照旧命中，不回归", () => {
  const out32 = applyReplacementsToText(LEGACY_SURFACE, patch(32), "web-app-lib.js").text;
  assert.ok(out32.includes("through the local web GUI at ${webUrl}."));
  const out53 = applyReplacementsToText(out32, patch(53), "web-app-lib.js").text;
  assert.ok(out53.includes("Local web GUI: ${webUrl}."));
});

test("#32 在 #53 收尾后仍能被判定为已完成（合并展示不误报 skipped）", () => {
  let text = applyReplacementsToText(NEW_SURFACE, patch(32), "dev-context.js").text;
  text = applyReplacementsToText(text, patch(53), "dev-context.js").text;
  const hitAny = (patch(32).markers ?? []).some((m) => text.includes(m));
  assert.ok(hitAny, "#32 的 marker 必须覆盖 #53 的终态，否则状态显示 skipped");
});

test("旧版链路同样不误报", () => {
  let text = applyReplacementsToText(LEGACY_SURFACE, patch(32), "web-app-lib.js").text;
  text = applyReplacementsToText(text, patch(53), "web-app-lib.js").text;
  const hitAny = (patch(32).markers ?? []).some((m) => text.includes(m));
  assert.ok(hitAny);
});
