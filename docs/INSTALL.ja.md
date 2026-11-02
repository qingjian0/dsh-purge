## インストール

**現在の fork 開発プレビュー:** 以下のコマンドは保守中の `adapt/android-mobile-upstream-1.1.88` ブランチからインストールします。ブランチのアーカイブはコミットにより変わるため、固定リリースではありません。

### 推奨: DSH CLI

実際に使用するホストを 1 つ選択してください。Web とデスクトップは別々の profile です。

```sh
# 公式 Web
dsh plugin --profile web add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88

# 公式デスクトップ
dsh plugin --profile desktop add https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

### 代替: pnpm

DSH CLI が使えない場合のみ、選択した profile 内で実行します。

```sh
cd "$DSH_HOME/profiles/web"   # desktop: profiles/desktop
pnpm add --allow-build=dsh-purge https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88
```

Windows PowerShell:

```powershell
cd "$env:USERPROFILE\.dsh\profiles\web"   # desktop: profiles\desktop
pnpm add --allow-build=dsh-purge "https://codeload.github.com/qingjian0/dsh-purge/tar.gz/refs/heads/adapt/android-mobile-upstream-1.1.88"
```

インストールフックは選択した profile にプラグインを登録し、Cordis の body insert を確認します。pnpm がビルドスクリプトを既定でブロックする場合、`--allow-build=dsh-purge` はこのパッケージだけを許可します。

### インストール後

1. インストールした同じホストを完全終了して再起動します。デスクトップではトレイプロセスも終了してください。
2. チャットを開き、セッションタイトルの横にある **dsh-purge** を確認します。
3. **Clean** を開いて **Apply** をクリックします。
4. チャットで `/purge status` を実行し、`DSH_HOME` が意図した profile であることを確認します。

インストールだけではパッチは適用されません。Web とデスクトップは個別にインストール・適用する必要があります。

### トラブルシューティング

ボタンが表示されない場合、選択した profile に以下があるか確認します。

- `node_modules/dsh-purge/package.json`
- `dsh-purge` を含む `dsh.profile.bundles`
- `dsh-purge` の body insert を含む `cordis.patch.yml`

登録が不足している場合、profile ディレクトリで次を実行してホストを再起動します。

```sh
node node_modules/dsh-purge/scripts/ensure-profile-bundle.mjs
```

pnpm が install hook をブロックした場合は、`--allow-build=dsh-purge` を付けて再インストールします。完全な手順は[インストールガイド](docs/INSTALL.ja.md)を参照してください。
