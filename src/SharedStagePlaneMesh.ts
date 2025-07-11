import { type Material, Mesh, PlaneGeometry } from "three";
import { CameraChaser } from "./CameraChaser.js";
import {
  isSharedStageMaterial,
  type TextureArea,
  updateUVAttribute,
} from "./SharedStageTexture.js";

/**
 * Plane mesh class that uses a single shared Canvas via SharedStageTexture for rendering.
 *
 * This class extends Three.js Mesh and displays a specific area of a shared texture
 * as a plane mesh. It also provides camera following functionality through CameraChaser.
 *
 * ## Overview
 *
 * This is a canvas-drawable plane object that uses SharedStageTexture
 * to display a specific region of the shared texture as a plane mesh.
 * Unlike billboards, it does not follow the camera by default, but can be made
 * to follow using CameraChaser.
 *
 * ## Comparison with MultiView Classes
 *
 * Compared to MultiViewPixiPlaneMesh, SharedStagePlaneMesh uses a single shared
 * Canvas via SharedStageTexture, allowing texture and material instances to be shared across
 * multiple plane meshes, which can significantly reduce draw calls.
 *
 * However, there are limitations:
 * - Shared Canvas size constraints can cause texture mapping failures with many meshes
 * - Frequent partial content updates require full shared Canvas redraws and GPU texture transfers, potentially reducing performance
 *
 * **Best Use Cases:**
 * SharedStagePlaneMesh is ideal when you have a relatively fixed number of plane meshes
 * and want to reduce draw calls for optimal performance.
 *
 * ## Geometry Implementation Notes
 *
 * The geometry uses PlaneGeometry. To offset from the center point, use the translate method:
 * https://threejs.org/docs/#api/en/core/BufferGeometry.translate
 *
 * UV coordinates are set for each vertex. This implementation assumes 4 vertices
 * and 2 polygons - other geometry configurations may not work correctly.
 *
 * @example
 * ```typescript
 * // Create shared texture and material
 * const sharedTexture = new SharedStageTexture();
 * await sharedTexture.init(1024, 1024);
 * const sharedMaterial = new MeshBasicMaterial({
 *   map: sharedTexture,
 *   transparent: true
 * });
 *
 * // Create plane mesh with specific texture area
 * const planeMesh = new SharedStagePlaneMesh(
 *   sharedMaterial,
 *   { x: 0, y: 0, width: 256, height: 256 }
 * );
 *
 * // Enable camera following (optional)
 * planeMesh.cameraChaser.enabled = true;
 *
 * scene.add(planeMesh);
 * ```
 */
export class SharedStagePlaneMesh extends Mesh {
  public cameraChaser: CameraChaser = new CameraChaser(this);

  /**
   * Returns a clone of the current texture area.
   *
   * This method creates a shallow copy of the texture area object to prevent
   * external modifications to the internal state.
   *
   * @returns A copy of the texture area in pixel coordinates
   * @example
   * ```typescript
   * const currentArea = planeMesh.cloneTextureArea();
   * console.log(currentArea); // { x: 0, y: 0, width: 256, height: 256 }
   * ```
   */
  cloneTextureArea(): TextureArea {
    return { ...this._textureArea };
  }

  /**
   * Updates the texture area displayed by this plane mesh and refreshes UV mapping.
   *
   * This method updates the texture area and regenerates the geometry if the dimensions
   * have changed. It also updates the UV coordinates to reflect the new region.
   *
   * @param value - The new texture area in pixel coordinates
   * @example
   * ```typescript
   * // Move plane mesh to display a different area of the shared texture
   * planeMesh.updateTextureAreaAndUV({
   *   x: 256,
   *   y: 256,
   *   width: 128,
   *   height: 128
   * });
   * ```
   */
  updateTextureAreaAndUV(value: TextureArea) {
    const prevTextureArea = { ...this._textureArea };
    this._textureArea = { ...value };

    if (
      prevTextureArea.width !== value.width ||
      prevTextureArea.height !== value.height
    ) {
      this.geometry = new PlaneGeometry(value.width, value.height);
    }
    this.updateUVAttribute();
  }

  /**
   * Creates a new SharedStagePlaneMesh instance.
   *
   * The constructor initializes the plane mesh with a shared material that must contain
   * a SharedStageTexture. It sets up the geometry based on texture area dimensions,
   * applies UV mapping for the specified texture area, and initializes the CameraChaser.
   *
   * @param sharedMaterial - The shared Material instance that contains a SharedStageTexture
   * @param _textureArea - The texture area to display in pixel coordinates
   *
   * @throws {Error} If the sharedMaterial does not contain a SharedStageTexture
   *
   * @example
   * ```typescript
   * const sharedTexture = new SharedStageTexture();
   * await sharedTexture.init(1024, 1024);
   * const material = new MeshBasicMaterial({ map: sharedTexture });
   *
   * const planeMesh = new SharedStagePlaneMesh(
   *   material,
   *   { x: 0, y: 0, width: 256, height: 256 }
   * );
   *
   * // Optional: Enable camera following
   * planeMesh.cameraChaser.enabled = true;
   * ```
   */
  constructor(
    public sharedMaterial: Material,
    private _textureArea: TextureArea,
  ) {
    super();

    if (!isSharedStageMaterial(sharedMaterial)) {
      throw new Error("sharedMaterial.map must be SharedStageTexture");
    }
    this.geometry = new PlaneGeometry(_textureArea.width, _textureArea.height);
    this.material = sharedMaterial as unknown as Material;
    this.updateUVAttribute();
  }

  /**
   * Updates the geometry's UV coordinates for the current texture area.
   *
   * This method configures the UV mapping to display the specified texture area
   * from the shared texture on this plane mesh instance.
   */
  private updateUVAttribute(): void {
    updateUVAttribute(this.geometry, this.sharedMaterial, this._textureArea);
  }
}
