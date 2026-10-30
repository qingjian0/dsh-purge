import { test } from "node:test";
import assert from "node:assert/strict";
import { isAndroidHost, shimApplicable, adapterFor, detectSurface } from "../lib/surface.js";

test("isAndroidHost 认 Node 的 android platform", () => {
  assert.equal(isAndroidHost({ platform: "android", env: {} }), true);
});

test("isAndroidHost 认 Termux 前缀", () => {
  assert.equal(isAndroidHost({ platform: "linux", env: { PREFIX: "/data/data/com.termux/files/usr" } }), true);
  assert.equal(isAndroidHost({ platform: "linux", env: { PREFIX: "/data/user/0/dsh.dsh.mobile/files/usr" } }), true);
});

test("isAndroidHost 认 DSH_ANDROID 显式开关，且可被 0 关掉", () => {
  assert.equal(isAndroidHost({ platform: "linux", env: { DSH_ANDROID: "1" } }), true);
  assert.equal(isAndroidHost({ platform: "android", env: { DSH_ANDROID: "0" } }), false);
});

test("桌面/普通 Linux 不被误判成 Android", () => {
  assert.equal(isAndroidHost({ platform: "win32", env: {} }), false);
  assert.equal(isAndroidHost({ platform: "darwin", env: {} }), false);
  assert.equal(isAndroidHost({ platform: "linux", env: { PREFIX: "/usr" } }), false);
});

test("shimApplicable 在 Android 上为 false，其它宿主为 true", () => {
  assert.equal(shimApplicable({ platform: "android", env: {} }), false);
  assert.equal(shimApplicable({ platform: "linux", env: { PREFIX: "/usr" } }), true);
  assert.equal(shimApplicable({ platform: "win32", env: {} }), true);
});

test("Android 仍按 web 面适配（没有独立 android adapter）", () => {
  const input = { platform: "android", env: {}, argv: ["/system/bin/node", "/x/@deepseek-ai/dsh/lib/bin.js"], execPath: "/system/bin/node" };
  assert.equal(detectSurface(input), "web");
  assert.equal(adapterFor("web"), "web");
});
