import type { Texture } from "three";
import type { Container } from "pixi.js";

/**
 * Interface that defines the contract for renderable PixiJS views in the MultiView billboard system.
 *
 * This interface establishes the core properties and capabilities that all MultiView billboard
 * implementations must provide. It ensures consistency across different MultiView classes
 * and enables polymorphic usage of billboard objects.
 *
 * ## Design Philosophy
 *
 * The IRenderablePixiView interface abstracts the common characteristics of MultiView billboards:
 * - **Resource Management**: Tracks disposal state to prevent memory leaks
 * - **Rendering Pipeline**: Provides access to PixiJS container and HTML canvas
 * - **Three.js Integration**: Exposes the texture for use in Three.js materials
 * - **Extensibility**: Designed to accommodate future enhancements
 *
 * ## Implementation Classes
 *
 * This interface is implemented by:
 * - `MultiViewPixiBillboard`: Sprite-based billboard with independent PixiJS canvas
 * - `MultiViewPixiPlaneMesh`: Mesh-based billboard with independent PixiJS canvas
 *
 * ## Usage Context
 *
 * The interface is primarily used by:
 * - `PixiMultiViewManager` for managing collections of MultiView instances
 * - Application code that needs to work with MultiView objects polymorphically
 * - Type guards and utility functions that operate on MultiView objects
 *
 * @example
 * ```typescript
 * // Polymorphic usage with different MultiView implementations
 * const billboards: IRenderablePixiView[] = [
 *   new MultiViewPixiBillboard(options),
 *   new MultiViewPixiPlaneMesh(options)
 * ];
 *
 * // Work with all billboards uniformly
 * billboards.forEach(billboard => {
 *   if (!billboard.isDisposed) {
 *     billboard.container.addChild(sprite);
 *   }
 * });
 *
 * // Type-safe access to common properties
 * function updateBillboard(view: IRenderablePixiView) {
 *   if (view.isDisposed) return;
 *
 *   // Access PixiJS container
 *   view.container.visible = true;
 *
 *   // Access Three.js texture
 *   view.texture.needsUpdate = true;
 * }
 * ```
 */
export interface IRenderablePixiView {
  /**
   * Flag indicating whether this view has been disposed and should no longer be used.
   *
   * When `true`, the view's resources have been cleaned up and the object should be
   * considered invalid. Accessing other properties or methods after disposal may
   * result in undefined behavior.
   *
   * ## Usage Guidelines
   *
   * - Always check this flag before accessing other properties
   * - Set to `true` during the disposal process
   * - Use for defensive programming to prevent accessing disposed resources
   *
   * @example
   * ```typescript
   * if (!billboard.isDisposed) {
   *   billboard.container.addChild(sprite);
   * }
   * ```
   */
  isDisposed: boolean;

  /**
   * The PixiJS Container that serves as the root for this view's display objects.
   *
   * This container is where all PixiJS content should be added for this particular
   * billboard instance. Each MultiView billboard has its own independent container,
   * allowing for isolated content management.
   *
   * ## Container Characteristics
   *
   * - **Independent**: Each billboard has its own container instance
   * - **Isolated**: Changes to one container don't affect others
   * - **Manageable**: Can be cleared, repositioned, or transformed independently
   *
   * ## Usage Notes
   *
   * - Add sprites, graphics, and other PixiJS objects to this container
   * - Container transforms (position, scale, rotation) affect all child objects
   * - Container is automatically rendered to the billboard's canvas
   *
   * @example
   * ```typescript
   * // Add content to the billboard's container
   * const sprite = new PIXI.Sprite(texture);
   * billboard.container.addChild(sprite);
   *
   * // Transform the entire container
   * billboard.container.scale.set(2, 2);
   * billboard.container.position.set(50, 50);
   * ```
   */
  container: Container;

  /**
   * The HTML canvas element that this view renders to.
   *
   * This canvas is created and managed by the PixiJS Application instance within
   * the MultiView billboard. The canvas content is automatically updated when
   * the PixiJS container is modified and rendering is triggered.
   *
   * ## Canvas Characteristics
   *
   * - **Independent**: Each billboard has its own canvas instance
   * - **Managed**: Created and sized automatically by PixiJS
   * - **Renderable**: Content is rendered from the PixiJS container
   *
   * ## Usage Notes
   *
   * - Do not modify the canvas directly; use the PixiJS container instead
   * - Canvas dimensions are determined by the MultiView options
   * - Canvas is used as the source for the Three.js texture
   *
   * @example
   * ```typescript
   * // Access canvas properties (read-only)
   * console.log(`Canvas size: ${billboard.canvas.width}x${billboard.canvas.height}`);
   *
   * // Canvas is automatically used as texture source
   * const texture = billboard.texture; // Uses this canvas
   * ```
   */
  canvas: HTMLCanvasElement;

  /**
   * The Three.js Texture that uses this view's canvas as its source.
   *
   * This texture is automatically created and configured to use the view's canvas
   * as its image source. The texture is updated when the PixiJS content changes
   * and rendering is triggered.
   *
   * ## Texture Characteristics
   *
   * - **Canvas-based**: Uses the view's canvas as the image source
   * - **Auto-updating**: Reflects changes in the PixiJS container
   * - **Three.js compatible**: Can be used with any Three.js material
   *
   * ## Usage Notes
   *
   * - Use this texture with Three.js materials (SpriteMaterial, MeshBasicMaterial)
   * - Texture updates are triggered by the MultiView rendering system
   * - Texture dimensions match the canvas dimensions
   *
   * @example
   * ```typescript
   * // Use texture with Three.js materials
   * const material = new SpriteMaterial({
   *   map: billboard.texture,
   *   transparent: true
   * });
   *
   * // Create sprite with the texture
   * const sprite = new Sprite(material);
   * scene.add(sprite);
   * ```
   */
  texture: Texture;
}
