---
name: pixijs-v8-migration-guide
description: PixiJS v8 API reference and migration patterns. Use when writing PixiJS code, reviewing PixiJS usage, or troubleshooting v7-style API calls.
allowed-tools: Read
---

# PixiJS v8 API Reference

Detailed API patterns for PixiJS v8. For quick rules, see CLAUDE.md "PixiJS v8 Specific Rules" section.

Official migration guide: https://pixijs.com/8.x/guides/migrations/v8

---

## Module Imports

Single package structure. Import everything from `pixi.js`:

```typescript
import { Application, Sprite } from "pixi.js";
```

---

## Async Application Initialization

`Application` requires async `init()`:

```typescript
const app = new Application();
await app.init({
  // application options
});
```

---

## Texture and Graphics API

### BaseTexture Removed

`BaseTexture` replaced by `TextureSource`. `Texture` handles loaded resources only.

### Graphics: Shape-First, Then Style

Define shape first, then apply `fill`/`stroke`:

```typescript
const graphics = new Graphics().rect(50, 50, 100, 100).fill(0xff0000);

const graphics2 = new Graphics()
  .rect(50, 50, 100, 100)
  .fill("blue")
  .stroke({ width: 2, color: "white" });
```

### Graphics: Holes with `cut()`

```typescript
const rectAndHole = new Graphics()
  .rect(0, 0, 100, 100)
  .fill(0x00ff00)
  .circle(50, 50, 20)
  .cut();
```

### Shortened Drawing Methods

| v7 | v8 |
|----|-----|
| `drawRect` | `rect` |
| `drawCircle` | `circle` |
| `beginFill` / `endFill` | `fill` (after shape) |
| `lineStyle` | `stroke` (after shape) |
| `beginHole` / `endHole` | `cut` |

### GraphicsGeometry Replaced

`GraphicsGeometry` replaced by `GraphicsContext` for shared graphics data.

---

## Shaders and Filters

- Textures are Resources, not Uniforms
- Uniform definitions require `type` field
- Community filters: import from `pixi-filters/<name>` (not `@pixi/filter-*`)

```typescript
import { AdjustmentFilter } from "pixi-filters/adjustment";
```

---

## ParticleContainer

- Uses `Particle` class (not `Sprite`)
- Uses `addParticle` / `removeParticle` (not `addChild`)
- Children stored in `particleChildren` (not `children`)
- Requires `boundsArea` at initialization

```typescript
import { ParticleContainer, Particle, Rectangle } from "pixi.js";

const container = new ParticleContainer({
  boundsArea: new Rectangle(0, 0, 500, 500),
});
const particle = new Particle(texture);
container.addParticle(particle);
```

---

## Other Breaking Changes

| v7 | v8 |
|----|-----|
| `DisplayObject` | Removed; `Container` is the base class |
| `updateTransform` | Removed; use `onRender` callback |
| `Application.view` | `Application.canvas` |
| `NineSlicePlane` | `NineSliceSprite` |
| `SimpleMesh` | `MeshSimple` |
| `container.name` | `container.label` |
| `container.cacheAsBitmap` | `container.cacheAsTexture()` |
| `container.getBounds()` returns `Rectangle` | Returns `Bounds`; use `.rectangle` property |
| `settings` object | Removed; use `AbstractRenderer.defaultOptions`, `DOMAdapter` |
| `utils` object | Removed; import functions directly |
| `SCALE_MODES`, `WRAP_MODES`, `DRAW_MODES` | Replaced by string values |
| `Texture.from(url)` | Must use `Assets.load()` first |
| `Ticker` callback receives delta | Callback receives `Ticker` instance |
| `eventMode` default `auto` | Default `passive` |

### Leaf Nodes Cannot Have Children

`Sprite`, `Mesh`, `Graphics` etc. no longer accept children. Use `Container` as parent.

### Mipmap Updates

`RenderTexture` mipmap updates must be triggered manually via `updateMipmaps()`.

### Texture UV Changes

Texture UV changes are not auto-reflected on Sprites. Call `sprite.onViewUpdate()` or subscribe to `update` event.

### Culling

Manual culling via `Culler.shared.cull()` or `CullerPlugin`.

### Assets.add Signature Changed

`Assets.add` argument format has changed.

### Constructor Options

Many constructors now accept a single options object instead of multiple arguments.
