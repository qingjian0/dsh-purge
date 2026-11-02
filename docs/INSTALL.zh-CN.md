# dsh-purge 安装指南

> **当前为开发预览版安装方式：** 本指南安装开发分支 `adapt/android-mobile-upstream-1.1.88`。分支归档会随提交变化；只有对应 GitHub Release 正式发布后，才使用固定版本标签安装。

## 安装前检查

- 先安装官方 DeepSeek Harness。
- Node.js 版本需为 18 或更高，并使用 DSH 环境提供的包管理器。
- 只选择一个目标宿主：`dsh web` 使用 `web` profile；官方桌面端使用 `desktop` profile。两者相互独立。
- 不要从插件市场安装，也不要执行 `pnpm add dsh-purge`：本项目不是以这个名称发布在 npm registry 的包。

## 推荐方式：使用 DSH CLI

只执行与你实际使用的宿主对应的一条命令：

```sh
# 官方 Web 端
dsh plugin --profile web add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88

# 官方桌面端
dsh plugin --profile desktop add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

如果提示插件已经存在，先在**同一个 profile** 中卸载，再重新执行对应的 add 命令：

```sh
dsh plugin --profile web remove dsh-purge
# 然后重新执行上面的 Web 安装命令
```

桌面端将 `web` 替换为 `desktop`。

## 备用方式：使用 pnpm

仅在 DSH CLI 不可用时使用。先进入你选定的 profile 目录：

```sh
cd "$DSH_HOME/profiles/web"   # 桌面端改为 profiles/desktop
pnpm add --allow-build=dsh-purge https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

Windows PowerShell：

```powershell
cd "$env:USERPROFILE\.dsh\profiles\web"   # 桌面端改为 profiles\desktop
pnpm add --allow-build=dsh-purge "https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88"
```

部分 pnpm 版本默认阻止依赖安装脚本。`--allow-build=dsh-purge` 只允许本插件的安装脚本执行。如果 pnpm 交互式询问构建权限，只批准 **dsh-purge**，不要顺手批准其他依赖。

安装脚本会把插件写入当前 profile 的 `dsh.profile.bundles`，并确保 `cordis.patch.yml` 中存在插件本体的 body insert。**安装不等于应用补丁**，不会替你点击「应用」。

## 重启、应用与验证

1. 完全退出并重新打开刚才安装的**同一个宿主**。桌面端还要退出托盘进程，不能只关窗口。
2. 打开会话，在标题旁找到 **dsh-purge**。
3. 进入「清洗」页面，点击「应用」。成功应用后，宿主可能自动重启一次。
4. 在聊天中执行 `/purge status`。

成功的状态输出应能识别当前生效的 `DSH_HOME` 并显示补丁状态。Web 和桌面端互不代替：在一端安装或应用，不会修改另一端。

## 看不到按钮时

检查你安装的那个 profile，而不是仓库根目录：

- `node_modules/dsh-purge/package.json` 存在。
- profile 的 `dsh.profile.bundles` 包含 `dsh-purge`。
- profile 的 `cordis.patch.yml` 中存在 `dsh-purge` 本体 body insert。

如果插件文件存在，但 profile 注册缺失，可在该 profile 目录执行：

```sh
node node_modules/dsh-purge/scripts/ensure-profile-bundle.mjs
```

随后完全退出并重开宿主。如果安装脚本被 pnpm 拦截，使用上面的 pnpm 命令并带上 `--allow-build=dsh-purge` 重新安装。

如果 CLI 提示已经安装，但界面仍没有按钮，只卸载并重装**当前 profile** 中的 dsh-purge。不要删除整个 profile，也不要清理其他 bundle。

## 更新方式

当前 fork 尚未发布对应稳定标签前，使用本页顶部的开发分支地址。对应版本正式发布后，改用不可变的版本归档：

```
https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/tags/v1.1.88
```

将现有 profile 切换到正式版本时，在该 profile 中卸载旧版，再通过上面的 DSH CLI 或 pnpm 方式安装版本归档。

## 宿主范围与兼容性

Web 与桌面端必须分别安装、分别应用。只使用仓库 [适配范围](../README.zh-CN.md#适配范围) 中明确列出的 DSH 版本；不能仅凭插件版本号推断宿主兼容性。
