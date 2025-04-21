# デモページ生成コマンド概要

このプロジェクトでは、`npm run demo` コマンドを使用してデモページを生成します。

## コマンド

`npm run demo`

**実行されるスクリプト:**
`npx @masatomakino/gulptask-demo-page --body '<canvas id="webgl-canvas" width="640" height="480"></canvas>' --compileModule es2020`

## 機能

- `demoSrc/` ディレクトリ内を走査し、ファイル名が `demo_` プレフィックスで始まるすべてのJavaScriptファイルを自動的に検出します。
- 検出された各JavaScriptファイルを読み込むためのHTMLファイルを、`docs/demo/` ディレクトリに自動的に生成します。
- 生成されるHTMLファイルの名前は、対応するJavaScriptファイル名に基づきます（例: `demoSrc/demo_MultiView.js` → `docs/demo/demo_MultiView.html`）。

## 注意点

- 生成されたデモページは `docs/demo/` ディレクトリに配置されます。
- `docs/` ディレクトリはビルドプロセスによって自動生成されるため、このディレクトリ内のファイルをユーザーやエージェントが手動で作成、編集、または削除することは推奨されません。デモの内容を変更したい場合は、`demoSrc/` ディレクトリ内の対応するJavaScriptファイルを修正してください。
- `demoSrc/` ディレクトリに `demo_` プレフィックスで始まる新しいJavaScriptファイルを作成すれば、`package.json` の `demo` スクリプトを修正することなく、自動的に新しいデモページが生成対象として認識されます。
- 生成されるHTMLファイルの `<body>` 要素内には、`npm run demo` コマンドの `--body` 引数に渡されたDOM要素（デフォルトでは `<canvas id="webgl-canvas" width="640" height="480"></canvas>`）が含まれます。**生成するデモの用途に応じて、この要素をJavaScript側で操作する必要があります。** three.jsのレンダラーと結びつける場合はそのID (`webgl-canvas`) を参照し、必要がなければDOMから削除してください（例: `demoSrc/demo_MultiView.js` での実装）。

## デモソースからのビルド済みESMファイルのインポート

- `demoSrc`ディレクトリ内のファイルから、プロジェクトのビルド済みESMファイルをインポートする際は、相対パス`../esm/index.js`を使用してください。
