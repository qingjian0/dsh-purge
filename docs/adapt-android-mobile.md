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
