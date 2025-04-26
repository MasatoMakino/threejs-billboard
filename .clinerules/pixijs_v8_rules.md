# PixiJS v8 コーディング規約および移行ガイド

このドキュメントは、プロジェクトで使用されているPixiJS v8について、とくに注意すべき変更点とコーディング規約をまとめたものです。PixiJS v8はいくつかの破壊的変更が導入されています。v7以前の記法で記述しないよう、本ガイドを参照し、コードの実装を行ってください。

公式の移行ガイドも併せて参照することを強く推奨します: [https://pixijs.com/8.x/guides/migrations/v8](https://pixijs.com/8.x/guides/migrations/v8)

## 主な変更点

### 1. モジュールのインポート

PixiJS v8では、単一パッケージ構造に戻りました。v7で使用されていた `@pixi/*` スコープパッケージからのインポートは廃止され、`pixi.js` から直接インポートする形式になります。

**v7 (旧):**

```typescript
import { Application } from "@pixi/app";
import { Sprite } from "@pixi/sprite";
```

**v8 (新):**

```typescript
import { Application, Sprite } from "pixi.js";
```

### 2. 非同期初期化

`PIXI.Application` の初期化が非同期になりました。コンストラクターでオプションを渡す代わりに、`init` メソッドを使用し、`await` で待機する必要があります。

**v7 (旧):**

```typescript
import { Application } from "pixi.js";

const app = new Application({
  // application options
});
// do pixi things
```

**v8 (新):**

```typescript
import { Application } from "pixi.js";

const app = new Application();
(async () => {
  await app.init({
    // application options
  });
  // do pixi things
})();
```

### 3. Texture と Graphics API

- **BaseTexture の廃止**: `BaseTexture` は廃止され、代わりに `TextureSource` が導入されました。`Texture` はロード済みのリソースのみを扱います。
- **Graphics 描画順序の変更**: v8では、まず形状（`rect`, `circle` など）を定義し、その後で `fill` や `stroke` を適用するスタイルに変更されました。`Line` は `Stroke` に名称変更されました。
- **Graphics 関数名の変更**: 描画関数名が短縮されました (例: `drawRect` -> `rect`, `drawCircle` -> `circle`)。
- **`fill` / `stroke` 関数の変更**: これらの関数は、パラメーター文字列ではなく `FillStyle` または `StrokeStyle` オブジェクト、あるいは色を受け取るようになりました。`beginTextureFill` や `lineTextureStyle` は廃止されました。
- **穴の描画**: `beginHole` / `endHole` の代わりに、形状定義後に `cut()` 関数を使用します。
- **GraphicsGeometry の代替**: `GraphicsGeometry` は `GraphicsContext` に置き換えられ、Graphicsデータの共有が効率化されました。

**Graphics API コード例:**

**v7 (旧):**

```typescript
const graphics = new Graphics()
  .beginFill(0xff0000)
  .drawRect(50, 50, 100, 100)
  .endFill();

const graphics2 = new Graphics()
  .lineStyle(2, "white")
  .beginFill("blue")
  .circle(530, 50, 140, 100)
  .endFill();

const rectAndHole = new Graphics()
  .beginFill(0x00ff00)
  .drawRect(0, 0, 100, 100)
  .beginHole()
  .drawCircle(50, 50, 20)
  .endHole()
  .endFill();
```

**v8 (新):**

```typescript
const graphics = new Graphics().rect(50, 50, 100, 100).fill(0xff0000);

const graphics2 = new Graphics()
  .rect(50, 50, 100, 100)
  .fill("blue")
  .stroke({ width: 2, color: "white" });

const rectAndHole = new Graphics()
  .rect(0, 0, 100, 100)
  .fill(0x00ff00)
  .circle(50, 50, 20)
  .cut();
```

### 4. Shader と Filters

- **Shader 構築**: WebGLとWebGPUに対応するため、Shaderの構築方法が変更されました。TextureはUniformではなくResourceとして扱われます。
- **Uniform 定義**: Uniformを定義する際に、値だけでなく型（`type`）を指定する必要があります。
- **カスタムフィルター**: カスタムフィルターの構築方法もShaderの変更に合わせて調整が必要です。
- **コミュニティフィルター**: `@pixi/filter-*` パッケージはv8ではメンテナンスされません。代わりに `pixi-filters` パッケージからサブモジュールとしてインポートします。

**コミュニティフィルター インポート例:**

**v7 (旧):**

```typescript
import { AdjustmentFilter } from "@pixi/filter-adjustment";
```

**v8 (新):**

```typescript
import { AdjustmentFilter } from "pixi-filters/adjustment";
```

### 5. ParticleContainer

`ParticleContainer` はパフォーマンス向上のため大幅に変更されました。

- **子要素**: `ParticleContainer` は `Sprite` を子要素として受け入れなくなりました。代わりに `IParticle` インターフェイスを実装した軽量な `Particle` クラスを使用します。
- **子要素の管理**: 子要素は `children` 配列ではなく、`particleChildren` というフラットなリストに格納されます。追加・削除には `addParticle` / `removeParticle` メソッドを使用します。
- **Bounds**: `ParticleContainer` は自身の境界を計算しないため、初期化時に `boundsArea` を指定する必要があります。

**ParticleContainer コード例:**

**v7 (旧):**

```typescript
const container = new ParticleContainer();
for (let i = 0; i < 100000; i++) {
  const particle = new Sprite(texture);
  container.addChild(particle);
}
```

**v8 (新):**

```typescript
import { ParticleContainer, Particle, Rectangle } from "pixi.js";

const container = new ParticleContainer({
  boundsArea: new Rectangle(0, 0, 500, 500), // boundsArea の指定が必要
});
for (let i = 0; i < 100000; i++) {
  const particle = new Particle(texture); // Particle クラスを使用
  container.addParticle(particle); // addParticle メソッドを使用
}
```

### 6. その他の変更

- `DisplayObject` は削除され、`Container` がすべてのPixiJSオブジェクトの基底クラスとなりました。
- `updateTransform` は削除され、代わりに `onRender` 関数を使用してカスタムロジックを実行します。
- Mipmap生成の挙動が変更されました。`RenderTexture`のMipmap更新は開発者の責任で行う必要があります（`updateMipmaps()` を使用）。
- Texture UVの変更がSpriteに自動的に反映されなくなりました。手動で `sprite.onViewUpdate()` を呼び出すか、Textureの `update` イベントを購読して対応する必要があります。
- Containerのカリング方法が変更され、手動で `Culler.shared.cull()` を呼び出すか、`CullerPlugin` を使用する必要があります。
- Mesh関連のクラス名が変更されました（`SimpleMesh` -> `MeshSimple` など）。
- `Assets.add` の引数形式が変更されました。
- `settings` オブジェクトは削除され、`AbstractRenderer.defaultOptions` や `DOMAdapter` などで設定を行います。
- `Application` の型パラメーターが変更されました。
- `Texture.from` はURLからのロードを直接行わなくなりました。`Assets.load` で事前にロードしたリソースを使用する必要があります。
- `Ticker` のコールバック引数がdelta timeから `Ticker` インスタンスに変更されました。
- Textパーサーの名前が変更されました。
- デフォルトの `eventMode` が `passive` に変更されました。
- `utils` オブジェクトは削除され、関数は直接インポートする形式になりました。
- `container.getBounds()` は `Bounds` オブジェクトを返すようになり、Rectangleは `container.getBounds().rectangle` で取得します。
- `container.cacheAsBitmap` は `container.cacheAsTexture()` に名称変更されました。

## 非推奨機能

以下の機能はv8で非推奨となりました。代替機能への移行を推奨します。

- Leaf node（`Sprite`、`Mesh`、`Graphics` など）が子を持つことができなくなりました。代わりに `Container` を使用してください。
- `Application.view` は `Application.canvas` に名称変更されました。
- `NineSlicePlane` は `NineSliceSprite` に名称変更されました。
- `SCALE_MODES`、`WRAP_MODES`、`DRAW_MODES` といった定数は廃止され、対応する文字列を使用するようになりました。
- 多くのクラスのコンストラクターが、複数の引数ではなくオプションオブジェクトを受け取る形式に変更されました。
- `container.name` は `container.label` に名称変更されました。
