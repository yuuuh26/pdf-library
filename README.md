# PDF Library

Android Chromeを中心に使う、端末保存型の個人用PDFライブラリです。GitHub Pagesにはアプリだけを配置し、登録するPDFは外部へ送信しません。

## 機能

- PDF複数登録、表示名変更、フォルダ、タグ、お気に入り、最近開いたPDF
- 名前・元ファイル名・タグ・フォルダを入力中に検索
- PDF.js 6.3.289を同梱。Canvasで描画し、表示付近だけをレンダリング
- 縦スクロール、ピンチズーム（1〜5倍）、横幅フィット、ページ移動
- 閲覧ページとページ内位置を保存して再開
- 操作バーを約2.8秒後に隠し、タップで再表示
- メニューからマーカー、手書き、短いメモ。注釈はPDF原本と別に端末保存
- IndexedDB、永続ストレージ申請、PWA、オフライン表示、noindex/nofollow/noarchive
- PDF専用URL `./?pdf=UUID`。保存した端末の同じChromeプロファイルでのみ利用可能

## 特定PDFをホーム画面へ

PDFの「…」→「ホーム画面からこのPDFを開く」から専用URLをコピーしてください。
Chrome通常タブでそのURLを開き、Chromeの「⋮」から「ホーム画面に追加」または「インストールとショートカットを作成」→「ショートカットを作成」を選びます。

Chromeやランチャーのバージョンにより表示項目は異なります。PWA本体のインストールは特定PDFのショートカットと別です。個別ショートカットが作れない場合はChromeのブックマーク、またはアプリ内のお気に入りを利用してください。

**Android実機のランチャー上で、個別アイコンを追加して起動する検証は未完了です。** デスクトップChromeのモバイルエミュレーションでは、この操作は再現できません。専用URLが対象PDFを直接開く動作と区別して扱います。

参考：
- https://support.google.com/chrome/answer/15085120?co=GENIE.Platform%3DAndroid&hl=ja
- https://web.dev/articles/app-shortcuts
- https://mozilla.github.io/pdf.js/examples/

## 開発・公開

Node.js 22以上で `npm ci` → `npm run build`。生成される `dist/` が公開用です。
GitHub Actionsはブラウザ検証を行った後にPagesへデプロイします。
初回のPages有効化に権限が必要な場合は、リポジトリ Settings → Pages → SourceをGitHub Actionsに設定してください。

ローカルプレビュー：`node scripts/serve.mjs` → http://127.0.0.1:8765/pdf-library/
テスト：playwright 1.62.1とpdf-lib 1.17.1、Chromiumをインストールし、サーバー起動中に `node scripts/test.mjs`。

## 保存・更新

DB名は `yuu-pdf-library`、初版スキーマはバージョン1です。documentsに管理情報・閲覧位置・注釈、blobsにPDF、foldersにフォルダを保存します。PDF登録・削除は複数ストアを同一トランザクションで更新します。名前や閲覧位置は管理情報だけを更新します。

アプリは自動削除やDB初期化を行いません。将来のスキーマ変更はonupgradeneededに加算的マイグレーションを追加します。PDF削除は確認後、フォルダ削除ではPDFを未分類に移して保持します。

Service Workerのキャッシュ名はビルド内容のハッシュで変わります。更新は既存タブを閉じた後に有効化され、同アプリの古いキャッシュだけを削除します。IndexedDBは変更しません。他アプリのキャッシュを削除しません。

## 制限

- 端末間同期なし。Chromeのサイトデータ削除・端末初期化等ではデータが失われます。元のPDFも保管してください。
- 永続ストレージの許可はブラウザが決めます。許可はバックアップの代わりにはなりません。
- 注釈はアプリ内だけに保存します。「元のPDFを保存」には注釈を含みません。
- PDF内JavaScript、外部リンク、フォーム編集、文字選択・全文検索は初版では提供しません。
- noindexは認証やアクセス制限ではありません。GitHub Pagesのアプリコードは公開されます。
- ホーム画面への実際の追加、Android実機のピンチと回転は実機確認が必要です。

## ライセンス

同梱PDF.jsはMozilla / Apache-2.0。ビルド出力のvendor/LICENSEを参照してください。
