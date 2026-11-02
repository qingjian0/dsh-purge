# Install dsh-purge

> **Preview build:** this guide installs the current development branch `adapt/android-mobile-upstream-1.1.88`. Branch archives change when new commits are pushed. Use a version tag only after a matching GitHub Release has been published.

## Before you install

- Install the **official DeepSeek Harness** first.
- Use Node.js 18 or newer and the package manager supplied by your DSH installation.
- Choose exactly one host profile: `web` for `dsh web`, or `desktop` for the official desktop app. They are separate installations.
- This plugin is not installed from the plugin marketplace or the npm package name `dsh-purge`.

## Recommended: install with the DSH CLI

Run only the command for the host you actually use:

```sh
# Official Web host
dsh plugin --profile web add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88

# Official desktop host
dsh plugin --profile desktop add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

If the command reports that the plugin is already installed, remove it from that same profile and run the add command again:

```sh
dsh plugin --profile web remove dsh-purge
# Then repeat the Web add command above.
```

For desktop, replace `web` with `desktop`.

## Alternative: install with pnpm

Use this only when the DSH CLI is unavailable. Run the command inside the profile you selected:

```sh
cd "$DSH_HOME/profiles/web"   # desktop: profiles/desktop
pnpm add --allow-build=dsh-purge https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

Windows PowerShell:

```powershell
cd "$env:USERPROFILE\.dsh\profiles\web"   # desktop: profiles\desktop
pnpm add --allow-build=dsh-purge "https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88"
```

The `--allow-build=dsh-purge` option permits this package's install hook to run with pnpm versions that block dependency build scripts by default. If pnpm asks for build approval interactively, approve **dsh-purge only**. Do not approve unrelated packages.

The install hook adds the plugin to the selected profile's `dsh.profile.bundles` and ensures its `cordis.patch.yml` body insert exists. It does not apply host patches.

## Restart, apply, verify

1. Fully quit and reopen the **same host profile** you installed into. For desktop, quit the tray process as well as the window.
2. Open a chat and find **dsh-purge** beside the session title.
3. Open **Clean** and select **Apply**. A successful apply may restart that host once.
4. In chat, run `/purge status`.

A successful status response should identify the active `DSH_HOME` and report the patch state. Web and desktop are independent: installing or applying in one does not change the other.

## If the button is missing

Check the selected profile, not the repository root:

- `node_modules/dsh-purge/package.json` exists.
- The profile package's `dsh.profile.bundles` includes `dsh-purge`.
- The profile's `cordis.patch.yml` contains the `dsh-purge` body insert.

If the package exists but the profile registration is missing, run the repair script from the installed package:

```sh
node node_modules/dsh-purge/scripts/ensure-profile-bundle.mjs
```

Then fully quit and reopen the host. If the install hook was blocked, reinstall using the pnpm command above with `--allow-build=dsh-purge`.

If the CLI says the package is already present but the UI is still missing, remove and re-add it in the **same** profile. Do not delete the whole profile or edit unrelated bundles.

## Updating

Until a stable tag for this fork is published, install from the development branch URL at the top of this page. After a matching release is published, use its immutable source archive instead:

```
https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/tags/v1.1.88
```

To switch an existing profile to that release, remove `dsh-purge` from that profile and add the release archive using the same DSH CLI or pnpm method above.

## Scope and compatibility

The Web and desktop profiles must be installed and applied separately. Use only a DSH version explicitly listed as supported in the repository's [Supported hosts](../README.md#supported-hosts) section. Do not infer compatibility from the plugin version alone.
