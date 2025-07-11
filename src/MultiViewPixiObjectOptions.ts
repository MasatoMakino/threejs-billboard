import type { PixiMultiViewManager } from "./PixiMultiViewManager";

/**
 * Configuration options for MultiView billboard objects.
 *
 * This interface defines the common configuration properties required by
 * MultiView billboard implementations such as MultiViewPixiBillboard and
 * MultiViewPixiPlaneMesh. These options control the rendering manager,
 * canvas dimensions, and display scaling.
 *
 * @example
 * ```typescript
 * const options: MultiViewPixiObjectOptions = {
 *   manager: pixiMultiViewManager,
 *   width: 512,
 *   height: 512,
 *   scale: 1.0
 * };
 *
 * const billboard = new MultiViewPixiBillboard(options);
 * const planeMesh = new MultiViewPixiPlaneMesh(options);
 * ```
 */
export interface MultiViewPixiObjectOptions {
  /**
   * The PixiMultiViewManager instance that will handle rendering for this billboard.
   *
   * This manager coordinates the rendering of multiple MultiView instances using
   * a single PixiJS WebGL renderer. The manager must be initialized before
   * creating billboard instances.
   *
   * @example
   * ```typescript
   * const manager = new PixiMultiViewManager();
   * await manager.init();
   *
   * const options = {
   *   manager: manager,
   *   width: 256,
   *   height: 256
   * };
   * ```
   */
  manager: PixiMultiViewManager;

  /**
   * Width of the canvas in pixels.
   *
   * This determines the width of the HTML canvas element that will be created
   * for this billboard instance. The canvas serves as both the PixiJS render
   * target and the source for the Three.js texture.
   *
   * ## Performance Considerations
   *
   * - Larger canvas sizes require more memory and rendering time
   * - Power-of-2 dimensions (256, 512, 1024) may offer better performance
   * - Keep canvas size as small as possible for optimal performance
   */
  width: number;

  /**
   * Height of the canvas in pixels.
   *
   * This determines the height of the HTML canvas element that will be created
   * for this billboard instance. The canvas serves as both the PixiJS render
   * target and the source for the Three.js texture.
   *
   * ## Performance Considerations
   *
   * - Larger canvas sizes require more memory and rendering time
   * - Power-of-2 dimensions (256, 512, 1024) may offer better performance
   * - Keep canvas size as small as possible for optimal performance
   */
  height: number;

  /**
   * Optional scale factor for the billboard display size.
   *
   * This value determines how the billboard will be sized in the Three.js scene
   * relative to its canvas pixel dimensions. A scale of 1.0 means the billboard
   * will be sized to match the canvas dimensions in Three.js units.
   *
   * ## Scale Factor Behavior
   *
   * - **1.0**: Billboard size matches canvas pixel dimensions (default)
   * - **0.5**: Billboard appears at half the canvas pixel size
   * - **2.0**: Billboard appears at twice the canvas pixel size
   *
   * @default 0.1 (typically set by implementation classes)
   * @example
   * ```typescript
   * // Different scale examples
   * scale: 1.0,  // Full size (512px canvas = 512 units)
   * scale: 0.5,  // Half size (512px canvas = 256 units)
   * scale: 0.1,  // Small size (512px canvas = 51.2 units)
   * ```
   */
  scale?: number;
}
