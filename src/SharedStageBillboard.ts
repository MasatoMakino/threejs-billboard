import { PlaneGeometry, Sprite, type SpriteMaterial } from "three";
import {
  type TextureArea,
  isSharedStageMaterial,
  updateUVAttribute,
} from "./index.js";

/**
 * Billboard class that uses a single shared Canvas via SharedStageTexture for rendering.
 *
 * This class extends Three.js Sprite and displays a specific area of a shared texture
 * as a billboard. It utilizes SharedStageTexture for efficient resource management
 * across multiple billboard instances.
 *
 * ## Overview
 *
 * Uses SharedStageTexture to display a specific region of the shared texture as a billboard.
 * Each billboard instance references a different area of the same shared texture via UV mapping.
 *
 * ## Comparison with MultiView Classes
 *
 * Compared to MultiViewPixiBillboard, SharedStageBillboard uses a single shared Canvas
 * via SharedStageTexture, allowing texture and material instances to be shared across multiple billboards.
 * This approach can significantly reduce draw calls and improve performance.
 *
 * However, there are limitations:
 * - Shared Canvas size constraints can cause texture mapping failures with many billboards
 * - Frequent partial content updates require full shared Canvas redraws and GPU texture transfers, potentially reducing performance
 *
 * **Best Use Cases:**
 * SharedStageBillboard is ideal when you have a relatively fixed number of billboards
 * and want to reduce draw calls for optimal performance.
 *
 * ## Geometry Implementation Notes
 *
 * Unlike typical Sprite instances that use fixed BufferGeometry, SharedStageBillboard
 * uses PlaneGeometry for the following reasons:
 *
 * - Individual instances need to override UV attributes for texture area mapping
 * - Commonalize position and UV processing with SharedStagePlaneMesh
 *
 * **Important:** This implementation may be affected by major Three.js updates
 * that change Sprite class specifications.
 *
 * @example
 * ```typescript
 * // Create shared texture and material
 * const sharedTexture = new SharedStageTexture();
 * await sharedTexture.init(1024, 1024);
 * const sharedMaterial = new SpriteMaterial({
 *   map: sharedTexture,
 *   transparent: true
 * });
 *
 * // Create billboards with different texture areas
 * const billboard1 = new SharedStageBillboard(
 *   sharedMaterial,
 *   { x: 0, y: 0, width: 256, height: 256 },
 *   1.0
 * );
 * const billboard2 = new SharedStageBillboard(
 *   sharedMaterial,
 *   { x: 256, y: 0, width: 256, height: 256 },
 *   1.0
 * );
 *
 * scene.add(billboard1);
 * scene.add(billboard2);
 * ```
 */
export class SharedStageBillboard extends Sprite {
  /**
   * Gets the current image scale factor.
   *
   * @returns The scale factor applied to the billboard
   */
  get imageScale() {
    return this._imageScale;
  }

  /**
   * Sets the image scale factor and updates the billboard size.
   *
   * The scale factor determines how the billboard will be sized relative to
   * the texture area dimensions. A scale of 1.0 means the billboard size
   * matches the texture area pixel dimensions in Three.js units.
   *
   * @param value - The scale factor to apply
   */
  set imageScale(value: number) {
    this._imageScale = value;
    this.updateScale();
  }

  /**
   * Returns a clone of the current texture area.
   *
   * This method creates a shallow copy of the texture area object to prevent
   * external modifications to the internal state.
   *
   * @returns A copy of the texture area in pixel coordinates
   * @example
   * ```typescript
   * const currentArea = billboard.cloneTextureArea();
   * console.log(currentArea); // { x: 0, y: 0, width: 256, height: 256 }
   * ```
   */
  cloneTextureArea(): TextureArea {
    return { ...this._textureArea };
  }

  /**
   * Updates the texture area displayed by this billboard and refreshes UV mapping.
   *
   * This method updates both the texture area and the UV coordinates to reflect
   * the new region. It also updates the billboard scale to match the new area dimensions.
   *
   * @param value - The new texture area in pixel coordinates
   * @example
   * ```typescript
   * // Move billboard to display a different area of the shared texture
   * billboard.updateTextureAreaAndUV({
   *   x: 256,
   *   y: 256,
   *   width: 128,
   *   height: 128
   * });
   * ```
   */
  updateTextureAreaAndUV(value: TextureArea) {
    this._textureArea = { ...value };
    this.updateScale();
    this.updateUVAttribute();
  }

  /**
   * Creates a new SharedStageBillboard instance.
   *
   * The constructor initializes the billboard with a shared material that must contain
   * a SharedStageTexture. It sets up the geometry, applies UV mapping for the specified
   * texture area, and configures the initial scale.
   *
   * @param sharedMaterial - The SpriteMaterial instance that contains a SharedStageTexture
   * @param _textureArea - The texture area to display in pixel coordinates
   * @param _imageScale - The initial scale factor for the billboard
   *
   * @throws {Error} If the sharedMaterial does not contain a SharedStageTexture
   *
   * @example
   * ```typescript
   * const sharedTexture = new SharedStageTexture();
   * await sharedTexture.init(1024, 1024);
   * const material = new SpriteMaterial({ map: sharedTexture });
   *
   * const billboard = new SharedStageBillboard(
   *   material,
   *   { x: 0, y: 0, width: 256, height: 256 },
   *   1.0
   * );
   * ```
   */
  constructor(
    public sharedMaterial: SpriteMaterial,
    private _textureArea: TextureArea,
    private _imageScale = 1,
  ) {
    super();

    if (!isSharedStageMaterial(sharedMaterial)) {
      throw new Error("sharedMaterial.map must be SharedStageTexture");
    }

    /**
     * SharedStageBillboard does not share geometry between Sprite instances
     * because each instance needs individual UV coordinates.
     * PlaneGeometry is used to commonalize position and UV processing with SharedStagePlaneMesh.
     */
    this.geometry = new PlaneGeometry();

    this.material = sharedMaterial;
    this.updateScale();
    this.updateUVAttribute();
  }

  /**
   * Updates the billboard scale while maintaining the texture area's aspect ratio.
   *
   * This method applies the current image scale factor to the texture area dimensions
   * to determine the final billboard size in Three.js units.
   */
  private updateScale(): void {
    this.scale.set(
      this._textureArea.width * this._imageScale,
      this._textureArea.height * this._imageScale,
      1,
    );
  }

  /**
   * Updates the geometry's UV coordinates for the current texture area.
   *
   * This method configures the UV mapping to display the specified texture area
   * from the shared texture on this billboard instance.
   */
  private updateUVAttribute(): void {
    updateUVAttribute(this.geometry, this.sharedMaterial, this._textureArea);
  }
}
