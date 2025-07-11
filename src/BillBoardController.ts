import {
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
  TextureLoader,
} from "three";
import type { InitializedBillBoardOptions } from "./BillBoard.js";

/**
 * Type alias for materials that can be used with billboard objects.
 * Supports both MeshBasicMaterial for Mesh objects and SpriteMaterial for Sprite objects.
 */
export type BillBoardMaterial = MeshBasicMaterial | SpriteMaterial;

/**
 * Type alias for Three.js objects that can be used as billboard targets.
 * Supports both Mesh and Sprite objects for maximum flexibility.
 */
export type BillBoardObject3D = Mesh | Sprite;

/**
 * Core controller class that provides billboard functionality for both Mesh and Sprite objects.
 *
 * This class encapsulates the common logic for creating billboards, including:
 * - Asynchronous texture loading with error handling
 * - Automatic material creation based on target object type
 * - Dynamic scaling based on image dimensions and scale factors
 * - Geometry initialization for Mesh objects
 *
 * ## Design Philosophy
 *
 * The controller pattern allows both BillBoard (Sprite-based) and BillBoardPlane (Mesh-based)
 * classes to share the same core functionality while maintaining their specific characteristics.
 * This reduces code duplication and ensures consistent behavior across different billboard types.
 *
 * ## Texture Loading
 *
 * Texture loading is performed asynchronously through the `textureLoaderPromise`. The material
 * is initially hidden and becomes visible only after successful texture loading. This prevents
 * flickering or displaying empty billboards during the loading process.
 *
 * ## Scaling Behavior
 *
 * The scaling behavior differs between Sprite and Mesh targets:
 * - **Sprite**: Scale values are multiplied by image pixel dimensions
 * - **Mesh**: Scale values are applied directly to the geometry
 */
export class BillBoardController {
  /**
   * Current image scale factor applied to the billboard.
   */
  protected _imageScale: number;

  /**
   * The target Three.js object (Mesh or Sprite) that this controller manages.
   */
  protected _target: Mesh | Sprite;

  /**
   * Flag indicating whether the geometry has been initialized with actual image dimensions.
   * Used to ensure geometry is only initialized once for Mesh objects.
   */
  private isInitGeometry = false;

  /**
   * Promise that resolves when texture loading is complete or rejects on loading error.
   * This allows external code to wait for texture loading completion or handle errors.
   */
  readonly textureLoaderPromise: Promise<undefined | ErrorEvent>;

  /**
   * Creates a new BillBoardController instance.
   *
   * The constructor performs the following operations:
   * 1. Initializes the target object with a dummy/temporary geometry (for Mesh objects)
   * 2. Creates and applies appropriate material based on target type
   * 3. Starts asynchronous texture loading process
   * 4. Sets up material visibility and scaling after successful loading
   *
   * @param target - The Three.js object (Mesh or Sprite) to be controlled as a billboard
   * @param url - URL of the texture image file to load
   * @param imageScale - Initial scale factor for the image
   * @param option - Configuration options including texture filtering settings
   */
  constructor(
    target: BillBoardObject3D,
    url: string,
    imageScale: number,
    option: InitializedBillBoardOptions,
  ) {
    this._target = target;
    this._imageScale = imageScale;
    this.initDummyPlane(target);

    const mat = this.getMaterial(target);
    mat.visible = false;
    this._target.material = mat;

    this.textureLoaderPromise = new Promise((resolve, reject) => {
      new TextureLoader().load(
        url,
        (texture) => {
          texture.minFilter = option.minFilter;
          texture.colorSpace = "srgb";
          mat.map = texture;
          mat.needsUpdate = true;
          mat.visible = true;
          this.updateScale();
          resolve(undefined);
        },
        undefined,
        (e) => {
          reject(e);
        },
      );
    });
  }

  /**
   * Creates the appropriate material based on the target object type.
   *
   * Both materials are configured with consistent settings for transparency,
   * depth testing, and blending mode to ensure uniform appearance across
   * different billboard types.
   *
   * @param target - The target object that will use this material
   * @returns MeshBasicMaterial for Mesh objects, SpriteMaterial for Sprite objects
   */
  private getMaterial(
    target: BillBoardObject3D,
  ): MeshBasicMaterial | SpriteMaterial {
    const param = {
      blending: NormalBlending,
      depthTest: true,
      transparent: true,
    };
    if (target instanceof Mesh) {
      return new MeshBasicMaterial(param);
    }
    return new SpriteMaterial(param);
  }

  /**
   * Initializes Mesh objects with a tiny dummy plane geometry.
   *
   * This temporary geometry prevents rendering issues before the actual
   * image dimensions are known. The geometry will be replaced with the
   * correct dimensions once the texture loads successfully.
   *
   * @param target - The target object to initialize (only affects Mesh objects)
   */
  private initDummyPlane(target: BillBoardObject3D): void {
    if (target instanceof Mesh) {
      const size = 0.0000001;
      target.geometry = new PlaneGeometry(size, size);
    }
  }

  /**
   * Initializes the final geometry for Mesh objects using actual image dimensions.
   *
   * This method is called after texture loading completes and replaces the dummy
   * geometry with a PlaneGeometry that matches the loaded image's pixel dimensions.
   * The geometry is only initialized once to avoid unnecessary object creation.
   *
   * @param image - The loaded image element containing dimension information
   */
  private initGeometry(image: HTMLImageElement) {
    if (!(this._target instanceof Mesh)) return;
    if (this.isInitGeometry) return;

    this._target.geometry = new PlaneGeometry(image.width, image.height);
    this.isInitGeometry = true;
  }

  /**
   * Updates the target object's scale based on image dimensions and current scale factor.
   *
   * This method maintains the aspect ratio of the texture image while applying
   * the current imageScale factor. It also triggers geometry initialization
   * for Mesh objects if not already done.
   */
  private updateScale = () => {
    const map = (this._target.material as BillBoardMaterial).map;
    if (map == null || map.image == null) return;
    const img = map.image as HTMLImageElement;

    this.initGeometry(img);
    const scale = this.calculateScale(img);

    this._target.scale.set(scale.x, scale.y, 1);
  };

  /**
   * Calculates the appropriate scale values based on target type and image dimensions.
   *
   * The calculation differs between Sprite and Mesh objects:
   * - **Sprite**: Multiplies image pixel dimensions by the scale factor
   * - **Mesh**: Uses the scale factor directly (geometry already has correct dimensions)
   *
   * @param img - The loaded image element
   * @returns Object containing x and y scale values
   */
  private calculateScale(img: HTMLImageElement): { x: number; y: number } {
    if (this._target instanceof Sprite) {
      return {
        x: img.width * this._imageScale,
        y: img.height * this._imageScale,
      };
    }

    return {
      x: this._imageScale,
      y: this._imageScale,
    };
  }

  /**
   * Gets the current image scale factor.
   *
   * @returns The current scale factor applied to the billboard
   */
  get imageScale(): number {
    return this._imageScale;
  }

  /**
   * Sets the image scale factor and updates the billboard's visual scale.
   *
   * The scale factor determines how the image is sized in Three.js coordinate units.
   * Setting this value automatically triggers a scale update to reflect the change
   * immediately.
   *
   * ## Scale Factor Behavior
   *
   * - **For Sprite objects**: Scale factor is multiplied by image pixel dimensions
   * - **For Mesh objects**: Scale factor is applied directly to the object scale
   *
   * ## Pixel-Perfect Display
   *
   * When combined with ScaleCalculator.getDotByDotScale(), this allows for pixel-perfect
   * rendering where the billboard matches the exact pixel size of the source image.
   *
   * @param value - The scale factor to apply to the image
   * @example
   * ```typescript
   * // Set scale for pixel-perfect display
   * const scale = ScaleCalculator.getDotByDotScale(renderer.domElement.height, camera);
   * billboardController.imageScale = scale;
   *
   * // Double the size
   * billboardController.imageScale = 2.0;
   * ```
   */
  set imageScale(value: number) {
    this._imageScale = value;
    this.updateScale();
  }
}
