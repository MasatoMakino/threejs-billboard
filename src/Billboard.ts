import { LinearFilter, Sprite, type TextureFilter } from "three";
import { BillboardController } from "./BillboardController.js";

/**
 * Configuration options for Billboard instances.
 */
export interface BillboardOptions {
  /**
   * Texture minification filter to be applied to the loaded texture.
   * Defaults to LinearFilter if not specified.
   */
  minFilter?: TextureFilter;
}

/**
 * Initialized Billboard options with all required fields populated.
 */
export interface InitializedBillboardOptions extends BillboardOptions {
  /**
   * Texture minification filter applied to the loaded texture.
   */
  minFilter: TextureFilter;
}

/**
 * Utility for initializing Billboard options with default values.
 */
export const BillboardOptionUtil = {
  /**
   * Initializes Billboard options with default values.
   * @param option - Optional configuration object
   * @returns Initialized options with all required fields populated
   */
  init(option?: BillboardOptions): InitializedBillboardOptions {
    const initializedOption = option ?? {};
    initializedOption.minFilter ??= LinearFilter;
    return initializedOption as InitializedBillboardOptions;
  },
};

/**
 * A billboard class that uses image files as texture sources.
 *
 * This class extends Three.js Sprite and provides a simple interface for creating
 * billboards that always face the camera. It automatically loads the specified
 * image file and applies it as a texture to the sprite.
 *
 * ## Usage
 *
 * Billboard is ideal for simple image-based billboards where you need to display
 * static images that always face the camera. For more complex scenarios with
 * multiple billboards or dynamic content, consider using SharedStageBillboard
 * or MultiViewPixiBillboard.
 *
 * @example
 * ```typescript
 * // Create a basic billboard
 * const billboard = new Billboard("./texture.png", 1.0);
 * scene.add(billboard);
 *
 * // Create a billboard with custom texture filtering
 * const billboard = new Billboard("./texture.png", 1.0, {
 *   minFilter: NearestFilter
 * });
 *
 * // Scale the billboard to match pixel-perfect display (dot-by-dot)
 * const scale = ScaleCalculator.getNonAttenuateScale(renderer.domElement.height, camera);
 * billboard.imageScale = scale;
 * billboard.material.sizeAttenuation = false; // Required for dot-by-dot display
 * ```
 */
export class Billboard extends Sprite {
  private obj: BillboardController;

  /**
   * Creates a new Billboard instance.
   *
   * The constructor initializes the billboard synchronously, but texture loading
   * is performed asynchronously. If the image fails to load, the error will be
   * available through the BillboardController's textureLoaderPromise.
   *
   * @param url - URL of the texture image file to load
   * @param imageScale - Initial scale factor for the image
   * @param option - Optional configuration for texture filtering and other settings
   */
  constructor(url: string, imageScale: number, option?: BillboardOptions) {
    super();
    const initializedOption = BillboardOptionUtil.init(option);
    this.obj = new BillboardController(
      this,
      url,
      imageScale,
      initializedOption,
    );
  }

  /**
   * Gets the current image scale factor.
   * @returns The current scale factor applied to the image
   */
  get imageScale(): number {
    return this.obj.imageScale;
  }

  /**
   * Sets the image scale factor.
   *
   * The scale factor determines how the image is sized relative to its original dimensions
   * in Three.js coordinate system units (meters by default).
   *
   * ## Scale Factor Behavior
   *
   * - **Scale = 1.0**: The billboard size matches the source image pixel dimensions directly
   *   in Three.js units. A 64px × 64px image creates a 64 × 64 unit billboard.
   * - **Scale = 0.5**: The billboard becomes half the pixel dimensions (32 × 32 units for a 64px image)
   * - **Scale = 2.0**: The billboard becomes twice the pixel dimensions (128 × 128 units for a 64px image)
   *
   * ## Pixel-Perfect Rendering
   *
   * When combined with ScaleCalculator.getNonAttenuateScale(), this allows for pixel-perfect
   * rendering where the billboard matches the exact pixel size of the source image on screen.
   * This requires setting `sizeAttenuation = false` on the material.
   *
   * @param value - The scale factor to apply to the image
   * @example
   * ```typescript
   * // Scale to 50% of original pixel dimensions
   * billboard.imageScale = 0.5;
   *
   * // Direct pixel-to-unit mapping (64px image = 64 units)
   * billboard.imageScale = 1.0;
   *
   * // Scale for pixel-perfect display (dot-by-dot)
   * const scale = ScaleCalculator.getNonAttenuateScale(renderer.domElement.height, camera);
   * billboard.imageScale = scale;
   * billboard.material.sizeAttenuation = false; // Required for dot-by-dot display
   * ```
   */
  set imageScale(value: number) {
    this.obj.imageScale = value;
  }
}

/**
 * @deprecated Use Billboard instead. This class name will be removed in a future version.
 */
export { Billboard as BillBoard };

/**
 * @deprecated Use BillboardOptions instead. This interface name will be removed in a future version.
 */
export type BillBoardOptions = BillboardOptions;

/**
 * @deprecated Use InitializedBillboardOptions instead. This interface name will be removed in a future version.
 */
export type InitializedBillBoardOptions = InitializedBillboardOptions;

/**
 * @deprecated Use BillboardOptionUtil instead. This utility name will be removed in a future version.
 */
export { BillboardOptionUtil as BillBoardOptionUtil };
