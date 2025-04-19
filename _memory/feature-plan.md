# 新規機能実装計画の背景と検討事項

## 1. プロジェクト概要

- 3D空間上に2D描画を行い、ビルボードとして表示するためのライブラリ。
- 2D描画エンジンとして [PixiJS](https://pixijs.com/) を利用。

## 2. 過去の実装と変更経緯

- **旧実装:**
  - 各ビルボードに対して、個別のCanvasとCanvas 2Dコンテキスト (context2d) を生成していた。
  - `1ビルボード = 1 context2d` の独立した描画方式。
- **変更理由:**
  - PixiJSがv7以降、Canvas 2Dコンテキストのサポートを終了し、WebGLレンダリングに一本化。
  - WebGLコンテキストは、1つのJavaScript環境内で生成できるインスタンス数に制限がある。
- **現行実装 (WebGL対応):**
  - インスタンス数制限に対応するため、アーキテクチャを変更。
  - **単一の共有Canvas** と **単一の共有WebGLコンテキスト (PixiJS Application)** をすべてのビルボードで共有。
  - 各ビルボードの描画内容は、共有Canvas上の特定領域に描画される。
  - 共有Canvas全体をテクスチャとして扱い、各ビルボードに対応する3DオブジェクトのUV座標を調整して表示を切り分ける。

## 3. 現行実装の課題

- 不定長のビルボード（多数または大きなビルボード）を扱う場合、共有Canvasが巨大化する。
- 巨大なCanvasでは、一部のビルボード（Canvas上の小さな領域）を更新するだけでも、Canvas全体の再描画とGPUへのテクスチャ転送が必要となる。
- これにより、とくに部分的な更新が多い場合にパフォーマンスが悪化する。

## 4. パフォーマンス改善のための検討アプローチ

現行実装のパフォーマンス課題を解決するため、以下の2つのアプローチを検討中。

### アプローチ1: Context2Dへの回帰 （Konva.js利用）

- **概要:** Canvas 2Dコンテキストをサポートする別のライブラリ [Konva.js](https://github.com/konvajs/konva) を導入し、旧実装に近い「1ビルボード = 1描画コンテキスト」の方式に戻す。
- **メリット:**
  - ビルボードごとの独立した描画領域により、部分更新のコストが低い。
  - Konva.jsは実績のあるライブラリ。
- **デメリット:**
  - PixiJS（WebGL）から離れることになる。
  - 新たなライブラリ依存が増える。

### アプローチ2: 複数Canvas + 単一WebGLコンテキスト (PixiJS v8 multiView利用)

- **概要:** PixiJS v8で導入されたmultiViewオプション ([関連PR](https://github.com/pixijs/pixijs/pull/10913)) を活用する。ビルボードごとに（またはグループごとに）個別のCanvas（TextureSource）を生成し、それらを単一のPixiJSレンダラー（WebGLコンテキスト）で効率的に管理・描画する。
- **メリット:**
  - PixiJSのWebGLレンダリングパイプラインを活用できる。
  - Canvasが小さくなるため、部分更新のコストが低減される可能性がある。
  - PixiJSエコシステム内で完結できる。
- **デメリット:**
  - 利用するPixiJSの機能が比較的新しく、実績や参考情報が少ない。
  - 実装の複雑さやパフォーマンス特性が未知数な部分がある。

## 5. 今後の計画

- **理想:** アプローチ2を採用したい。PixiJSの機能を最大限活用できるため。
- **懸念:** アプローチ2の実現可能性（とくにパフォーマンスと実装の容易さ）が不透明。
- **次の一手:** アプローチ2の実現可能性を検証するための**実験 (Proof of Concept)** を行う。
  - **ステップ1: 基本動作検証**
    - **目的:** PixiJS v8 `multiView` オプションの基本動作、とくにレンダラー直接生成時の挙動を確認する。
    - **方法:** [関連PR](https://github.com/pixijs/pixijs/pull/10913) のコード例を再現する。
    - **評価項目:**
      - 異なるサイズのCanvasを正常にレンダリングできるか？
      - 個別のCanvasのレンダリングタイミングを制御できるか？
  - （ステップ2以降はステップ1の結果を踏まえて計画）
- **代替案:** 実験の結果、アプローチ2が困難と判断された場合は、アプローチ1 (Konva.js) の採用を再検討する。

## 6. 実験結果: PixiJS v8 multiViewオプションの検証

### 実験の目的

PixiJS v8 multiViewオプションが、当初想定した「1ビルボード = 1描画コンテキスト」に近い独立した描画方式の実現に適しているか、その技術的な実現可能性と挙動を検証する。

### 実験内容

- 異なるサイズの32個のCanvas要素を生成し、DOMに追加。
- `autoDetectRenderer` を `multiView: true` オプション付きで生成。
- 各Canvasに対応するPixiJSコンテナーと描画内容（グラデーション付きの円）を作成し、単一のルートコンテナー（`stage`）に追加。
- 各Canvasにクリックイベントリスナーを追加し、クリック時にそのCanvasの描画内容を更新し、再レンダリングを行うデモコードを作成。
- PixiJSのソースコード（`AbstractRenderer.ts`, `GlContextSystem.ts`, `RenderTargetSystem.ts`, `GlRenderTargetAdaptor.ts`, `CanvasSource.ts`）を調査し、multiViewモードの内部的な仕組みを分析。

### 実験結果から判明したmultiViewの挙動

- multiViewモードでは、レンダリングはまずDOMにアタッチされないオフスクリーンCanvas（メインCanvas）に対して行われる。
- ターゲットCanvas（`renderer.render` の `target` オプションで指定されたCanvas要素）にはフレームバッファーが存在せず、WebGLレンダリングの直接の対象ではない。
- オフスクリーンCanvasに描画された内容は、レンダリングパスの終了後（`GlRenderTargetAdaptor` の `postrender` メソッド内）、ターゲットCanvasの2DレンダリングコンテキストにCanvas 2D APIの `drawImage` を使用してコピーされる。
- このコピー処理は、オフスクリーンCanvasの左下隅を原点として行われる。
- 意図した描画結果（各ターゲットCanvasへの表示）を得るためには、`renderer.render(stage)` でオフスクリーンCanvasに描画内容を準備し、その後 `renderer.render({ container, target: canvas })` でターゲットCanvasにコピーするという、2回のレンダリング呼び出しが必要であることが判明した。

### 考察

- multiView機能は、ソースコードの構造や挙動から、「単一のstageの描画結果を複数のCanvasに効率的に振り分ける」ことを主な目的として設計されていると推測される。
- これは、ユーザーの本来のユースケースである「複数のCanvasがそれぞれ独立したstageを持つかのように扱う」という目的とは設計思想が完全に一致しない。
- しかし、デモ実験で示したように、各Canvasに対応するコンテナーの `renderable` プロパティを手動で切り替えます。そして、`renderer.render(stage)` と `renderer.render({ container, target: canvas })` の2回の呼び出しを組み合わせることで、各Canvasに対して独立した描画内容を管理し、必要なCanvasだけを選択的にレンダリング・コピーすることが技術的に可能です。
- ただし、この方法ではレンダリングの順番やコンテナーの表示/非表示を手動で管理する必要があり、ライブラリ側の管理項目と実装の複雑さが増加する。

### 結論

PixiJS v8のmultiViewアプローチは、手動でのレンダリング管理を前提とすれば目的とする機能の実現は可能だ。しかし、機能の設計思想がユースケースと完全に一致しないため、実装および管理のコストが増加する可能性がある。

## 7. 実装計画（PixiJS v8 multiViewアプローチ、独立クラス、レンダラー管理クラス、最適化されたレンダリング管理、Three.js連携、独立マテリアル、メモリ管理、テスト容易性向上、カプセル化）

実験結果を踏まえ、PixiJS v8 multiViewアプローチを採用したビルボードおよびプレーンメッシュの実装計画は以下の通りです。既存機能への影響を最小限に抑えつつ、新しい機能を独立した形で開発・検証できるアーキテクチャを目指します。

### 7.1. アーキテクチャ

- **新規クラスの導入:**
  - PixiJS v8 multiViewを使用した新しいビルボードクラス（例: `MultiViewPixiBillboard`）およびプレーンメッシュクラス（例: `MultiViewPixiPlaneMesh`）を `src/` ディレクトリに独立して作成します。これらのクラスは、対応するThree.jsのMesh（PlaneGeometryなどを使用）を持ちます。
  - 各インスタンスは、コンストラクター内部でそれぞれ独立したHTMLCanvasElementとPixiJS Containerを持ちます。
  - 各インスタンスは、コンストラクター内部でそれぞれ独立したThree.jsのマテリアル（例: `MeshBasicMaterial`）を生成し、その `map` パラメーターに、インスタンスに対応するHTMLCanvasElementから生成したThree.jsのCanvasTextureを割り当てます。([Three.js MeshBasicMaterial.map](https://threejs.org/docs/?q=meshbasi#api/en/materials/MeshBasicMaterial.map))
  - リソース破棄メソッド: `MultiViewPixiBillboard` および `MultiViewPixiPlaneMesh` クラスに、インスタンスが保持するリソース（HTMLCanvasElement, PixiJS Container, Three.js Material, Three.js Texture）を適切に破棄するための `dispose` または `destroy` メソッドを実装します。
  - 破棄フラグ: 各インスタンスに `isDisposed` のような真偽値フラグを持たせ、`dispose`/`destroy` メソッドが呼び出された際に `true` に設定するようにします。
  - Containerの公開方法: `MultiViewPixiBillboard` および `MultiViewPixiPlaneMesh` クラスのメンバー変数であるPixiJS Containerは、外部から参照可能である必要がありますが、上書きを防ぐために **readonlyプロパティとして公開するか、getterメソッド経由でのみ参照可能とします。**
  - レンダラー管理クラスの導入: 単一のPixiJS `Renderer` インスタンス（`multiView: true` で初期化）を生成・管理し、複数のビルボード/プレーンメッシュインスタンスからのレンダリング要求を調整するための新しいクラス（例: `PixiMultiViewManager`）を `src/` ディレクトリに作成します。このクラスのコンストラクターは、オプションでPixiJSの `Ticker` インスタンスを受け取れるようにし、デフォルト値として `Ticker.shared` を使用します。
- `MultiViewPixiBillboard` および `MultiViewPixiPlaneMesh` の各インスタンスは、コンストラクターで `PixiMultiViewManager` のインスタンスを受け取るようにします。
- 既存の `src/BillBoard.ts`、`src/BillBoardPlane.ts`、`src/SharedStageBillboard.ts`、`src/SharedStagePlaneMesh.ts` は維持します。

### 7.2. レンダリング管理

- `PixiMultiViewManager` クラス内に、コンストラクターで受け取ったtickerを利用してレンダリングループを監視する仕組みを実装します。
- `PixiMultiViewManager` は、レンダリングが必要な `MultiViewPixiBillboard` および `MultiViewPixiPlaneMesh` インスタンスを保持するための内部スタック（Setなどが適しているでしょう）を持ちます。
- `MultiViewPixiBillboard` および `MultiViewPixiPlaneMesh` の各インスタンスは、自身の描画内容が更新された際に、コンストラクターで受け取った `PixiMultiViewManager` インスタンスに対してレンダリングリクエストを行います。このリクエストは、マネージャーの内部スタックに自身（インスタンス）を登録する形で行われます。
- `PixiMultiViewManager` は、tickerの更新タイミングで内部スタックを確認し、スタックに登録されているすべてのインスタンスに対して以下のレンダリング処理を実行します。
  - 破棄済みインスタンスの確認: 処理対象のインスタンスの `isDisposed` フラグを確認し、`true` の場合はそのインスタンスの処理をスキップし、スタックから削除します。
  - 対象インスタンスに対応するコンテナーのみを可視化。
  - 単一のルート `stage` に対して `renderer.render(stage)` を呼び出し、オフスクリーンCanvasに描画内容を準備。
  - 対象インスタンスに対応するCanvasをターゲットとして `renderer.render({ container, target: canvas })` を呼び出し、オフスクリーンCanvasの内容をターゲットCanvasにコピー。
  - 可視化を解除。
  - 対象インスタンスが持つThree.jsのテクスチャに対して `texture.needsUpdate = true` を設定します。([Three.js Texture.needsUpdate](https://threejs.org/docs/#api/en/textures/Texture.needsUpdate))
  - 処理が完了したインスタンスをスタックからクリア。
- この仕組みにより、単一フレーム内で同じインスタンスが複数回レンダリングされることを防ぎ、効率的な更新が可能になります。

### 7.3. 既存コードへの影響

- `src/SharedStageBillboard.ts` および `src/SharedStagePlaneMesh.ts` は直接変更せず、新しい `MultiViewPixiBillboard`、`MultiViewPixiPlaneMesh`、`PixiMultiViewManager` クラスを新規に作成します。
- `src/index.ts` に新しいクラスをエクスポートとして追加することを検討します。

### 7.4. ScaleCalculatorとCameraChaserへの影響

- `ScaleCalculator` および `CameraChaser` は、新しい `MultiViewPixiBillboard` および `MultiViewPixiPlaneMesh` クラスから利用可能である必要があります。これらのユーティリティクラスが、必要に応じて `PixiMultiViewManager` を通じて情報にアクセスする必要があるか検討します。

### 7.5. テスト計画

- 新規に作成する `MultiViewPixiBillboard`、`MultiViewPixiPlaneMesh`、`PixiMultiViewManager` クラスに対して、専用のユニットテストを作成します。
- とくに、`PixiMultiViewManager` の以下の点をテストする。
  - スタックベースのレンダリング管理が正しく機能し、重複レンダリングが防止されるか
  - 各ビルボード/プレーンメッシュが期待通りに描画されるか
  - Three.js側でテクスチャが正しく更新されるか
- メモリ管理のテスト: `dispose`/`destroy` メソッドがリソースを正しく解放するか、破棄されたインスタンスがレンダリングスタックから除外されるかを確認するテストを追加します。
- tickerの注入: `PixiMultiViewManager` のコンストラクターにtickerを注入する機能を利用し、単体テスト内でレンダリングループの挙動を詳細に制御・検証するテストを作成します。
- 既存の `ScaleCalculator` および `CameraChaser` のテストは、新しいクラスと組み合わせて実行し、連携が正しく行われるかを確認します。
- 既存の `SharedStageBillboard` および `SharedStagePlaneMesh` のテストはそのまま維持します。
