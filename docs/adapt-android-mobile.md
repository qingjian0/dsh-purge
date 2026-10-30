# Android / 移动端适配说明（0.2.1-rc.2）

本分支（`adapt/android-mobile`）在 **YuJunZhiXue/dsh-purge @ 1.1.82** 基础上，做了面向
**Android 引擎（DSH 安卓包 / Termux 内嵌 node）** 与 **dsh 0.2.1-rc.2 新文案布局** 的适配。
上游约定不变：原版不允许倒卖，二开必须署名 —— 见 `README.zh-CN.md` 的「署名要求」。

## 环境指纹（本分支的验证基线）

| 项 | 值 |
| --- | --- |
| dsh 版本 | `@deepseek-ai/dsh` 0.2.1-rc.2 |
| Node | v24.22.1，`process.platform === "android"`，`process.arch === "arm64"` |
| 引擎插件根 | `<app>/files/engine/lib/node_modules/@deepseek-ai` |
| DSH_HOME | `<app>/files/dsh-home`（= `$HOME`） |
| profile | `$DSH_HOME/profiles/web`（pnpm workspace，bundle 里挂 `dsh-purge`） |
| 宿主面 | `web`（`dsh web` 由 App 拉起，**PATH 里没有 `dsh` 启动器**） |
| 浏览器打开 | 有 `/system/bin/am`、`termux-open`；`xdg-open` 是 Termux 封装，缺 termux-api 时静默失败 |
| 无 | `git`、PowerShell、Windows 桌面安装 |

## 改了什么（逐条）

### 1. 宿主识别：`lib/surface.js`

新增两个导出：

- `isAndroidHost(input?)` —— 判据只有三条，任一命中即算 Android：`process.platform === "android"`、
  `PREFIX` 落在 `com.termux` / `/files/usr`、或显式 `DSH_ANDROID=1`（`DSH_ANDROID=0` 可强制关掉）。
  不做文件系统探测，桌面端不会误判。
- `shimApplicable(input?)` —— Android 恒为 `false`。

`detectSurface()` 未改动：Android 仍走 `web` 适配器，没有引入第四种宿主面。

### 2. shim 语义：不再把「没有 shim」当故障

Android 的入口固定是 `@deepseek-ai/dsh/lib/bin.js`，没有 `dsh` / `dsh.cmd` / `dsh.ps1`。

- `lib/core.js`：`findShimDir()` 在 Android 上直接返回 `null`，不再 fork `/bin/sh -c command -v dsh` 探测。
  新增 `isShimApplicable()` 供 UI / CLI 复用。
- `lib/core.js` 状态收集：不可用时 `shim_cmd / shim_ps1 / shim_bin` 记为 `"na"`。
- `bin/dsh-purge.js` + `lib/index.js`：显示为 `不适用（Android 无 shim） / n/a (android)`，
  不再是 `未定位 / not found` + `missing`（以前看起来像装坏了）。

### 3. 提示词补丁跟上 0.2.1-rc.2 的文件搬家

0.2.1-rc.2 把 Web 面身份提示词从 `dsh-web-app/lib/index.js` 搬到了
**`dsh-harness-dev-context/lib/index.js`**，并且 `${webUrl}` 拼接改成了「runtime context 命名」。

- `targetFiles()` 新增文件键 `dev-context` → `dsh-harness-dev-context/lib/index.js`
  （含 `packages/context/harness-dev-context` 源码树回退）。
- `#32 WEB_SURFACE_IDENTITY_NEUTRAL`：`file` 增加 `dev-context`，新增锚点
  `You are interacting with the user through the DeepSeek Harness Web GUI whose URL the runtime context names.`
  → `... local web GUI whose URL the runtime context names.`，markers 同步补新形态（`markersAny`）。
- `#53 WEB_SURFACE_PROHIBITION`：`file` 增加 `dev-context`；除旧 `${webUrl}` 形态外，
  同时收掉新版身份句（`Local web GUI: URL named in the runtime context.`），
  并摘掉 `Do not start a replacement server unless the user asks; …`。
  替换文本不再往提示词里塞 `// [dsh-purge] …` 注释。
- 旧 `${webUrl}` 文案的锚点保留，回归测试保证不回退。

### 4. `#77 REWIND_DROP_SENT_ON_APPEND` 锚点适配

0.2.1-rc.2 的 `append(record)` 在清 `revised` 前多了 `if (this.revised.size > 0)` 判断，
旧锚点整段失配（补丁长期 pending）。新增一条 pattern 覆盖新形态，
插入位置与上游一致（在清 revised **之前** return `replaceWindow(entries, this.hasMore)`），
`isRewindMarker` / `replaceWindow` 在该 bundle 中已存在（由 `#76` 保证）。

### 5. 打开浏览器：`lib/restart-web.js`

Android 分支依次尝试 `/system/bin/am start -a android.intent.action.VIEW -d <url>`、
`am`、`termux-open`，全失败就安静退出；不再调用 xdg-open（缺 termux-api 时会挂住或静默失败）。
桌面 / macOS / Linux 原逻辑不变。

## 本机验证结果

```
node --test              → tests 47 / pass 47 / fail 0   （上游 36 + 新增 11）
node bin/dsh-purge.js --status
  宿主 / surface web
  shim 目录      不适用（Android 无 shim） / n/a (android)
  shim: dsh.cmd=不适用/n-a  dsh.ps1=不适用/n-a  dsh=不适用/n-a
```

锚点对真实文件的命中（只读验证，未写引擎）：

| 补丁 | 目标文件 | 结果 |
| --- | --- | --- |
| #32 | `dsh-harness-dev-context/lib/index.js` | `changed=true`，产品名已中立化 |
| #53 | 同上 | `changed=true`，禁止另开服务器句已摘 |
| #77 | `dsh-client-ui-conversation/lib/client.js` | `changed=true`，rewind 分支插入且保留 `size` 判断 |

仍是 `na` / `missing_file` 的补丁都属正常：`#71 / #28` 要 `preset-liangshen`（本机没装），
`#80` 要上游早期注入残留（本机是官方原样），桌面类 `#45/#46/#82/#83/#84` 与 Android 无关。

## 安装到这台设备

插件根 = 引擎目录，profile 在 `$DSH_HOME/profiles/web`：

```sh
cd "$HOME/profiles/web"
pnpm add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile
# 或本机目录：pnpm add /path/to/dsh-purge-fork
```

装完完全退出宿主再打开（App 走 `boot.sh` / `_dsh_http.sh` 时整进程重启），
然后会话里 `/purge status` 看补丁表。

## 回滚

- 插件自带：`/purge revert` 还原引擎原始文件（备份在 `$DSH_HOME/dsh-purge`），`/purge uninstall` 卸载并重启。
- profile 侧：`pnpm remove dsh-purge` 后从 `package.json` 的 `dsh.bundle.bundles` 里去掉 `dsh-purge`。
- 本次改动只落在插件自身文件，未改引擎里的任何 `@deepseek-ai/*` 源码。

---

## 悬浮窗（dock）移动端适配

悬浮窗是 `client.js` 里的两个 fixed 层：清洗面板 `.dshp-dock` / 启动按钮 `.dshp-launch`，
以及演练台 `.rt-dock`。它们在桌面浏览器上没问题，在手机 WebView 上有四个硬伤，本分支逐条修掉。

### 1. 宽度被 380px 硬下限撑破

`defaultDockGeom` / `clampDockGeom` 原来写死 `min-width:380`。360dp 手机可用宽度只有 `vw-16=344`，
结果悬浮窗横向溢出、右侧按钮点不到。

改成下限跟随视口（`dockMinSize`）：

```js
const minW = Math.max(240, Math.min(380, vw - 16));
const minH = Math.max(200, Math.min(320, vh - 16));
```

| 视口 | minW | 实际默认宽 | 说明 |
| --- | --- | --- | --- |
| 360×640（手机） | 344 | 344（左右各 8px） | 原来会溢出 36px |
| 412×915 | 380 | 396 | 维持原下限 |
| 1280×800（桌面） | 380 | 620 | 行为不变 |

窄屏默认几何也改了：`y` 从 48 降到 8，底部预留从 `DOCK_COMPOSER_CLEAR(172)` 降到 8
（手机上输入框本来就由页面自己滚动，别让悬浮窗悬在半空）。

### 2. 拖动 / 缩放只监听鼠标事件

原来 5 个手柄（头部 + 左右下 + 右下角）都是 `onMouseDown` + `mousemove/mouseup`。
手指按住拖动时，浏览器不会持续派发合成的 `mousemove`，拖到一半就断，还会顺手把页面滚走。

改成 Pointer Events + 指针捕获（`trackDockPointer`）：

- `onPointerDown` 绑定（dock 头部与 4 个手柄）；
- `setPointerCapture` 后手指滑出面板也继续跟手；
- `pointermove` 用 `{ passive: false }`，`pointerup` / `pointercancel` 都能收尾；
- 手柄 CSS 本来就有 `touch-action:none`，滚动不会再抢事件。

演练台 `.rt-dock` 是同一套问题，但它属于 `lib/redteam/client.js`（构建时注入 `client.js`
的 `__DSH_PURGE_DRILL_BEGIN__` 段）。所以两边同步改：源码里的 `trackPointer` 换成 pointer 版，
4 个手柄与 `.rt-head` 改 `onPointerDown`，再跑 `node scripts/build-client.mjs` 重建产物。
源码与产物各有一条契约测试，谁被改回去都会红。

### 3. 刘海屏 / 手势条遮挡

新增媒体查询 `@media (max-width:560px),(pointer:coarse)`：

- `.dshp-launch` 的 `bottom/right` 叠加 `env(safe-area-inset-bottom/right)`，不再压在系统手势条上；
- 启动按钮高度 36 → 40、字号 14；dock 头部 `min-height:44px`、tab `min-height:42px`；
- resize 手柄加宽（右下手柄 22 → 28）、左右 10 → 16、底部 10 → 18，手指好按；
- `.dshp-dock` / `.rt-dock` 加 `max-height:calc(100dvh - 8px)`：移动浏览器地址栏收起时
  `100vh` 会大于可视区，`dvh` 才是真高度；
- 大面积 `backdrop-filter` 在低端 Android WebView 上很贵，移动端降到 `blur(10px)`；
- 弹窗 `.dshp-auth-mask` / `.rt-modal` 的 padding 24 → 12，`.dshp-auth-modal` 限高
  `calc(100dvh - 24px)`，`.dshp-auth-legal` 从固定 300px 高改成 `max-height:34vh`。

### 4. 验证

```
node --test        → 54 passed / 0 failed（新增 5 条悬浮窗契约测试）
```

`test/mobile-dock.test.js` 钉住的东西：移动端样式块存在、无 `onMouseDown: start*` 残留、
源码与产物都走 pointer、几何公式在 360/412/1280 三档视口的边界值、窄屏默认几何分支。

改完需要重启宿主 + 刷新页面（`client.js` 是客户端 bundle，服务端重新分发后才生效）。
