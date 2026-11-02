<p align="center">
  <img src="docs/banner.svg" alt="dsh-purge" width="720">
</p>

<h1 align="center">⚔️ DeepSeek Harness cybersecurity red-team tool (dsh-purge)</h1>

<p align="center"><strong>Version 1.1.88</strong></p>

<p align="center">
  <em>DeepSeek Harness jailbreak: every model, swap prompts per model. Default prompt for 小码酱. Please star ⭐ If you build on this, see Attribution required.</em>
</p>

<p align="center">
  <a href="https://github.com/YuJunZhiXue/dsh-purge/stargazers"><img src="https://img.shields.io/github/stars/YuJunZhiXue/dsh-purge?logo=github&label=Stars" alt="GitHub stars"></a>
  <a href="https://github.com/YuJunZhiXue/dsh-purge/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=flat" alt="Apache-2.0"></a>
  <a href="https://awesome-dsh-plugin.com"><img src="https://awesome-dsh-plugin.com/badge.svg" alt="awesome · DSH plugin"></a>
  <a href="https://deepseek.stream/plugins/dsh-purge"><img src="https://img.shields.io/badge/Hub-dsh--purge-1a73e8" alt="DeepSeek Harness Hub"></a>
  <a href="https://www.deepseek.com/harness/"><img src="https://img.shields.io/badge/dsh-0.2.0--rc.2%20%2F%200.2.1--rc.2-blue" alt="DSH"></a>
  <br>
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=fff" alt="Node.js">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000" alt="JavaScript">
</p>

<p align="center">
  <a href="https://dsh-plugin.org/plugins/yujunzhixue/dsh-purge"><img src="https://dsh-plugin.org/badges/listed.svg" alt="Listed on dsh-plugin.org"></a>
</p>

<p align="center">
  <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a> | <a href="README.ja.md">日本語</a>
</p>

## A note from the author

People have been selling this open-source work in the open. After that, the author was asked to come in and talk. No need to spell out the rest. Read between the lines.

From now on the **public internet is closed**. The open-source build only allows **local lab IPs**: loopback and RFC1918. Domains are resolved first (including hosts); every answer must be private or loopback. A hosts trick that points `.lab` at a public IP, a failed lookup, or a mixed public answer is blocked. **Game cheats are forbidden** (aimbot, wallhack, memory edits against a game, anti-cheat bypass); the prompt and the session gate both stop them. This build does not ship the skill library or the knowledge base.

**The original build may not be resold.** Charging for it, skinning it, or hawking it in groups is not allowed. Forks are fine, but **you must attribute** and name the source: [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge). Hide the source or pass it off as your own, and you are on the other side.

The author's personal channel: [t.me/LLM_PoJia](https://t.me/LLM_PoJia). Notes and updates show up there.

## Contents

- [A note from the author](#a-note-from-the-author)
- [What this is](#what-this-is)
- [Attribution required](#attribution-required)
- [License](#license)
- [Supported hosts](#supported-hosts)
- [Install](#install)
- [Detailed installation guide](docs/INSTALL.md)
- [Preview](#preview)
- [Usage](#usage)
- [How it works](#how-it-works)
- [Restore](#restore)
- [Releases](#releases)

---

## What this is

**dsh-purge** is a cybersecurity red-team plugin for the official [DeepSeek Harness](https://www.deepseek.com/harness/) already installed on your machine. This fork preview is **1.1.88**. The inherited upstream compatibility baseline is **DSH 0.2.1-rc.2** (0.2.0 is also documented as working); **DSH 0.2.1-rc.3 and newer RCs are not listed as supported**. The UI changes in this fork have not yet been runtime-verified across host versions. Official **Web** (`dsh web`) and the official **desktop EXE** are separate installs and must be applied separately.

Harness does more than forward a prompt. It rewrites prompts, approval gates, sandbox policy, and session migration at runtime. Asking only “will the model answer” treats a host-layer block as a model refusal. This plugin separates those two layers on your own install, for controlled evaluation and for seeing which default policy is too tight.

| You get | What it does |
|---|---|
| **dsh-purge dock** | A button beside the session title opens the right dock. Two pages: Clean and Drill |
| **Clean** | Grouped patch status, Apply / Restore / Uninstall, prompt editor, multiple rule sets |
| **Drill** | Built into the stable release. After authorization: assets and the local environment. This build does not ship skills or the knowledge base. Local lab only |
| **Host policy** | Default copy, permission policy, and tool limits. Official capabilities stay. No second invented identity |
| **On start** | Checks and reapplies. After npm overwrites `node_modules`, you do not hand-edit files |

No hardcoded drive letters. It looks at `$DSH_HOME`, `.dsh` next to the dsh launcher, then `~/.dsh`. It does not patch the Harness source tree. **Apply** on the **Clean** page of **dsh-purge** is what writes the changes. Identity comes from the encrypted prompt shipped in the plugin, the text the prompt box shows by default. The host prompt file is not read.

It only touches the official `@deepseek-ai` packages and local config on the user's machine. It is not a public scanner and not an attack kit for third-party sites. The repo does not ship malware, unauthorized-exploit scripts, or payloads aimed at the public internet.

---

## The original may not be resold. Forks must attribute.

## Attribution required

**The original build may not be resold.** No paid resale, no skinned store listing, no hawking it in groups.

**Forks must attribute** and name the source repository: [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge). Same if you borrow the name, ideas, code, or prompts.

Hiding the source, passing it off as your own, or reselling the original will be pursued.

## License

This repo is [Apache License 2.0](./LICENSE). Forks and redistributions must keep the copyright notice and [NOTICE](./NOTICE), and name [YuJunZhiXue/dsh-purge](https://github.com/YuJunZhiXue/dsh-purge). The original may not be resold.

---

<a id="strict-legal--compliance-disclaimer"></a>

<div>

### ⚠️ <font color="red">Strict legal and compliance disclaimer</font>

<font color="red">

**Disclaimer:** This is a non-profit open-source project. It follows applicable laws and the rules of the platforms it uses, and is intended only for learning and research. Do not use it for any illegal or non-compliant purpose; the user bears any resulting consequences.

**Zero-tolerance statement:** This project opposes and forbids any illegal activity. The authors do not support, encourage, or assist unauthorized network attacks, exploit use, data theft, unlawful intrusion into computer information systems, or generation of illegal or prohibited content. **Anyone who uses this project for crime is solely responsible under the law. The authors have no liability.**

1. **This repository contains no illegal material.** The published code, docs, patches, and default prompt are **not** malware, backdoors, unauthorized pentest kits, ransomware, credential-stuffing scripts, or attack payloads aimed at the public internet or third-party systems. The project does not supply illegal content and does not incite, organize, or assist crime.
2. **Local official Harness only.** Security-eval patches and prompt injection run only on the **official DeepSeek Harness already installed on the user's machine** (`@deepseek-ai` packages, local profile / `$DSH_HOME`). The target is the user's own official local software, **not** someone else's website, server, account, or information system.
3. **Eval patches do not attack the public internet.** Apply, inject, revert, and uninstall stay in local files and local processes. They **do not scan, probe, intrude, or send attack traffic to any public host or unauthorized system**. Do not use this project as a jump host against the public internet. If "check for updates" is on, the plugin may only contact this plugin's own GitHub repository to compare versions. That is **not** an attack on third-party systems and is **not** authorization to penetrate anything.
4. **Lawful, controlled scope.** This project is an aid for red-team research and robustness evaluation on an **official Harness the user is entitled to administer**. **Do not run it against targets without the owner's lawful written authorization, public online systems, or production workloads.** Testing must stay on the **authorized local official Harness, offline local synthetic fixtures, authorized cybersecurity ranges, and compliant lab environments**.
5. **The open-source build is local-lab only.** Attack tasks only allow loopback and RFC1918 addresses. Domains are resolved, then judged by IP; suffixes are not an allow list. A public IP, a name that resolves public, a failed lookup, or a hosts entry that points a lab name at the public internet is not an exception. A key, a password, a network range, a wildcard, or a claim made in the conversation does not add an exception. Game cheats are forbidden. This build does not ship the skill library or the knowledge base.
6. **Forbidden uses.** Users must not use this project, directly or indirectly, to violate the following (each must be followed; no excuse to evade):
   - <font color="red"><strong>Criminal Law of the People's Republic of China</strong></font>
   - <font color="red"><strong>Cybersecurity Law of the People's Republic of China</strong></font>
   - <font color="red"><strong>Data Security Law of the People's Republic of China</strong></font>
   - <font color="red"><strong>Personal Information Protection Law of the People's Republic of China</strong></font>
   - and other applicable laws, regulations, and supervisory rules;
   - Also forbidden:
   - Unauthorized intrusion or attacks on public or private computer information systems; extortion, sabotage, credential stuffing, or spreading malicious payloads;
   - Inducing, generating, or spreading any content the law forbids, including threats to national security, terrorism, violence, pornography, gambling, fraud, and privacy or intellectual-property infringement;
   - Violating the model provider's terms of service and acceptable-use policy.
7. **The user bears all responsibility.** The project is provided under Apache-2.0 as-is. The authors make no warranty of completeness, security, or fitness. **Users independently bear all civil, administrative, and criminal liability** for download, deploy, run, modify, distribute, and all resulting inputs and outputs. Authors and contributors bear no direct, indirect, or joint liability for abuse.
8. **The license ends on breach.** Anyone who uses this project for illegal attacks, malicious activity, or other violations has their open-source license **automatically and irrevocably terminated** from the moment of the violation. They must stop using the project, permanently destroy all copies and derivatives, and accept legal sanctions.
9. **No affiliation.** This is an independent open-source security-eval research project. It has no employment, commercial, authorization, or endorsement relationship with DeepSeek or its affiliates. "Official" here only means the eval target is the official DeepSeek Harness package on the user's machine. It does **not** mean DeepSeek developed, approved, or warrants this plugin.
10. **Attribution is required.** If you borrow this project's name, ideas, code, or prompts, you must credit the author and name this repository. Failure to attribute will be pursued. See [Attribution required](#attribution-required).

</font>

</div>

---

## Supported hosts

**Compatibility note:** the matrix below is inherited from upstream's 1.1.81 documentation. This fork is version 1.1.88, but its host compatibility has not been independently revalidated on every listed DSH build. Do not infer support for unlisted RCs.

- **dsh 0.2.1-rc.2** (official desktop / official `dsh web`): use **1.1.81**. Fixes `{{cwd}}` / `[cwd]` crash, patch #40 match, dropped `toolFilter`, host `dsh-tools` resolve, hostFs fd, desktop helper self-kill, `file:` archive update, Ctrl+Enter steer.
- **dsh 0.2.0-rc.2**: use **1.1.40** or newer; this line also installs.
- **dsh 0.1.7** (incl. rc.1 / rc.2): use **1.1.39** or older — pick the tag on [Releases](https://github.com/qingjian0/dsh-purge/releases).
- **dsh 0.2.1-rc.3 / rc.4 and newer are not supported.** Unmatched patches stay pending or skipped; nothing is rewritten blindly. Stay on **0.2.1-rc.2**.

Unmatched patches stay pending or skipped; nothing is rewritten blindly.

---

## Install

**Current fork preview:** these commands install `1.1.88` from the maintained development branch. The archive changes as commits are pushed; it is not an immutable release.

### Recommended: DSH CLI

Choose the profile for the host you actually use. Web and desktop are separate:

```sh
# Official Web host
dsh plugin --profile web add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88

# Official desktop host
dsh plugin --profile desktop add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

### Alternative: pnpm

Use only if the DSH CLI is unavailable. Run inside the selected profile:

```sh
cd "$DSH_HOME/profiles/web"   # desktop: profiles/desktop
pnpm add --allow-build=dsh-purge https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

Windows PowerShell:

```powershell
cd "$env:USERPROFILE\.dsh\profiles\web"   # desktop: profiles\desktop
pnpm add --allow-build=dsh-purge "https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88"
```

The install hook registers the plugin in the selected profile and ensures its Cordis body insert. The pnpm flag allows this package's install hook when build scripts are blocked by default.

### Finish installation

1. Fully quit and reopen the same host. On desktop, quit the tray process too.
2. Open a chat and find **dsh-purge** beside the session title.
3. Open **Clean** and click **Apply**.
4. Run `/purge status` in chat and confirm the reported `DSH_HOME` is the profile you intended.

Installing does not apply patches automatically. Web and desktop must each be installed and applied separately.

### Troubleshooting

If the button is missing, check the selected profile for:

- `node_modules/dsh-purge/package.json`
- `dsh.profile.bundles` containing `dsh-purge`
- `cordis.patch.yml` containing the `dsh-purge` body insert

If registration is missing, run this from the profile directory, then restart the host:

```sh
node node_modules/dsh-purge/scripts/ensure-profile-bundle.mjs
```

If pnpm blocked the install hook, reinstall with `--allow-build=dsh-purge`. If the CLI says the package is already installed, remove and re-add it in that same profile; do not delete the profile or unrelated bundles.

For the complete procedure and update instructions, see the [installation guide](docs/INSTALL.md).

## Preview

**dsh-purge** sits beside the session title. It opens a right-hand dock with two pages: **Clean** and **Drill**. Switch **Light / Ink**. Patches are grouped; the count only includes items that actually applied. Rule sets sit in a list above the editor, with Enable and Delete on each row.

The first time you open Drill you read the notice, wait out the countdown, scroll to the end, and check three boxes. Clean does not need that step. Drill is only for a host you manage, an offline target, or an exercise that already has written authorization.

**Clean**

![Clean](docs/preview/dock-clean.png)

**Drill authorization**

![Drill authorization](docs/preview/dock-auth.png)

**Drill**

![Drill](docs/preview/dock-drill.png)

**Patches**

![Patches](docs/preview/settings.png)

**Local lab**

The open-source build only allows localhost/private nets. The Clean page says so. You cannot register a public host.

| Area | What it shows |
|---|---|
| dsh-purge | button beside the session title; opens or collapses the dock |
| Clean | patches, prompt, rule sets |
| Drill | assets and environment after authorization. This build does not ship skills or the knowledge base. The tab says Unauthorized until then |
| Patches | grouped status, Apply, Restore, or Uninstall |
| Prompt | edit `prompt-inject.md` as the session override |
| Local lab | loopback / RFC1918 only; names are resolved, and every address must be private |
| Rule sets | multiple `AGENTS.md` / `CLAUDE.md`; Enable writes under `$DSH_HOME`, Delete removes the row |

---

## Layout

`bin/` is the CLI, `lib/` is patches and the drill console, `presets/redteam/` is the red-team preset, and `client.js` is the dock. This build does not ship `skills/` or the knowledge base.

Runtime files live under `$DSH_HOME`: `prompt-inject.md`, `rules/`, `redteam/`. If `DSH_HOME` is unset, the launcher-adjacent `.dsh` wins over `~/.dsh`. Web and the desktop app each use their own home.

---

## Usage

```sh
dsh-purge --status
dsh-purge --apply
dsh-purge --revert
dsh-purge --uninstall
dsh-purge --edit

/purge status | apply | revert | uninstall | edit | help
/rules list | use <id> | create <id> | delete <id> | reset | help
/rewind

# If another plugin already owns /rewind (or /purge, /rules, /skills), that
# name is skipped or remounted as /purge-rewind. Other commands, tools, and
# /dsh-purge/* routes keep working.

purge_status   purge_apply   purge_revert
```

After a successful Apply, the host restarts so patched packages load; you can also click **Restart** manually. Under the patch title are the stable release and the test release. The test release follows the `beta` branch. **Switch to stable** installs `master` and clears any pin. Picking an older stable version pins it; click **Update** to return to the latest. Old test tags are not listed.

The composer **Undo once** and **Undo last round** stay in the current conversation and do not open a branch. The sent line goes back into the input, and that cut's already-sent messages and completed tasks leave the current conversation; edit and **send again**. From **1.1.61**, rewind bounds follow the **current turn**, not the first user message. `/rewind` does the same.

If the **same task works in standard but fails in minimal or PTC**, preset `run_code`, sandbox, or plan intercept text is often still uncleared, or built-in minimal is missing `agent-instructions`. Use **1.1.61+**, then **quit the host fully → Apply in Clean → restart → start a new chat**. Switching preset alone does not reload patches in the running process.

### Response speed

DSH runs Bash calls in a tool batch one at a time. Older dsh-purge releases raised the default foreground wait from 60 seconds to 10 minutes, so one slow command could hold up later calls for that long. Patch #21 now restores marked plugin values to the official 60-second default. Unmarked timeouts and other custom values are preserved; an unmarked 10-minute value cannot reliably be distinguished from a user setting.

For a shorter wait in `dsh web` on macOS/Linux, add this entry to `$DSH_HOME/profiles/web/cordis.patch.yml` (normally `~/.dsh/profiles/web/cordis.patch.yml`). Edit an existing entry with the same id instead of adding a duplicate. This profile layer is applied after the bundled configuration, so future plugin applies keep the override.

```yaml
- id: bash-sandbox
  config:
    timeoutMs: 10000
```

With the standard jobs service and `promoteOnTimeout: true`, an unfinished command returns a background job id after 10 seconds and keeps running. Read it with `job_output` or stop it with `job_kill`. This changes the foreground wait, not the command's speed. Without that service or with promotion disabled, the timeout kills the command. A per-call `timeoutMs` overrides this default; `run_in_background: true` returns a job id immediately.

For routine tasks, you can also opt into Low reasoning for new sessions:

```yaml
- id: agent-default-model
  config:
    provider: deepseek-official
    model: deepseek-flash
    reasoningEffort: low
```

Restart `dsh web` to load the profile. The model and reasoning defaults apply to newly created sessions; select Low in the composer for an existing session. The plugin does not change these model preferences automatically. Keep High when the task needs deeper reasoning, and narrow file searches rather than recursively scanning every application directory.

### Local lab

Attack tasks are denied by default. The open-source build only allows loopback and RFC1918 IPs. Names are resolved first; a `.lab` / `.htb` suffix is not enough. A hosts entry that points a lab name at a public IP is blocked. Saying “this is my server” in chat does not allow it.

---

## Local checks

```sh
node --check lib/index.js
node --check lib/core.js
node --check lib/surface.js
node --check lib/web.js
node --check lib/desktop.js
node --check lib/host.js
node --check lib/rewind.js
node --check lib/skills.js
node --check client.js
```

---

## How it works

Apply, on start or when you click Apply:

```mermaid
flowchart TD
  A["Start or click Apply"] --> B{"Patch already in place?"}
  B -->|yes| C["Skip"]
  B -->|no| D["Back up the original as .dshpurge.bak"]
  D --> E["Replace the matched files"]
  E --> F["Override the shim"]
  F --> G["Inject the encrypted prompt shipped in the plugin, the text the prompt box shows by default"]
```

Override on each session:

```mermaid
flowchart TD
  A["Restart or new session"] --> B["Inject the plugin's encrypted default. No save click, and no host prompt file"]
```

Prompt injection and ruleset decision at every turn. The three inputs on the left are what you control in the dsh-purge panel; the dotted edges show which decision each one drives:

```mermaid
flowchart TD
  L["Rule library: activate a set → writes prompt-inject.md"]
  W["Local rules: check AGENTS.md / CLAUDE.md in the current dir"]
  P["Workspace policy: strict / fallback / always"]

  A["Turn start"] --> B{"prompt-inject.md non-empty?"}
  B -->|yes| C["Inject = prompt-inject.md (A)"]
  B -->|no| D{"Any checked local md in the current dir, non-empty?"}
  D -->|yes| E["Inject = selected workspace md (B)"]
  D -->|no| F["Inject = plugin encrypted slot default (D)"]
  C --> G{"Workspace baseline policy (C)"}
  E --> G
  F --> G
  G -->|strict| H["Drop DSH workspace baseline section"]
  G -->|fallback default| I{"User inject present above? (A or B)"}
  G -->|always| J["Keep DSH workspace baseline section"]
  I -->|yes| H
  I -->|no| J
  H --> K["Final system prompt"]
  J --> K

  L -.-> B
  W -.-> D
  P -.-> G
```

---

## Restore

- Each target is copied to `<file>.dshpurge.bak` before the first apply.
- **Restore** or `/purge revert` copies backups back and deletes them. With no backup, shim lines written by this plugin are stripped.
- `prompt-inject.md` is a user file and is kept.
- **Uninstall** restores first if patches were applied, then deletes the inject file, rule library, and the plugin itself.
- Apply is idempotent.

---

## Path detection

The host surface is detected first: `web` / `desktop` (`gui` / `tui` are reserved and still fall back to web).

**Web:**

1. `DSH_HOME` / `DSH_BASE`
2. `.dsh` next to the dsh launcher (portable install, any drive)
3. `npm prefix -g` / `npm root -g`
4. Nested `@deepseek-ai/dsh/node_modules/@deepseek-ai`
5. `~/.dsh`

**Official desktop EXE:** the running official Harness install (`resources/app` or the unpacked package). The drive letter is not hard-coded. A successful Apply restarts once.

Community Desktop is not maintained.

Official npm-global is not patched. Sealed `host-commands` / `runtime-commands` are scrubbed, never injected.

If nothing is found, set `DSH_BASE` / `DSH_DESKTOP_INSTALL`. No files are changed.

---

## Releases

The author's personal channel: [t.me/LLM_PoJia](https://t.me/LLM_PoJia). Notes and updates show up there. GitHub [Releases](https://github.com/qingjian0/dsh-purge/releases) still has older packages. The original may not be resold; forks must attribute.

## Notes

- Scope is rendered copy, defaults, and runtime logic inside local `@deepseek-ai/*` packages, plus override files and rule sets under the harness home.
- After an upgrade, unmatched originals show as skipped. Apply still completes, and those files are left unchanged.
- Third-party plugin *source repos* outside `@deepseek-ai` are left alone (CMD silence may **best-effort** patch installed doctor / market / liangshen / mnemon at runtime).
- Install from the GitHub tarball (the name is not on npm; skip the plugin market). With `dsh`: `dsh plugin --profile web add https://codeload.github.com/YuJunZhiXue/dsh-purge/tar.gz/refs/heads/master`. pnpm only: `pnpm add` that URL inside `$DSH_HOME/profiles/web`. Use `desktop` for the EXE. From this repo, `add .`.

---

Thanks to the [LINUX DO](https://linux.do) community

