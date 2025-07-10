import { Mesh } from "three";
import {
  type BillBoardOptions,
  BillBoardOptionUtil,
  CameraChaser,
} from "./index.js";
import { BillBoardController } from "./BillBoardController.js";

/**
 * A mesh-based billboard class that uses image files as texture sources with optional camera following.
 *
 * This class extends Three.js Mesh and provides a plane-based billboard that can optionally
 * rotate to face the camera horizontally. Unlike the Sprite-based BillBoard class, BillBoardPlane
 * uses PlaneGeometry and can be manipulated like any other Mesh object.
 *
 * ## Key Features
 *
 * - **Mesh-based rendering**: Uses PlaneGeometry with MeshBasicMaterial for reliable billboard display
 * - **Camera chasing**: Optional horizontal rotation to face the camera via CameraChaser
 * - **Standard mesh operations**: Supports Three.js Mesh features like transformations and positioning
 * - **Consistent API**: Shares the same interface as BillBoard for easy switching
 *
 * ## When to Use BillBoardPlane vs BillBoard
 *
 * **Use BillBoardPlane when:**
 * - You need mesh-specific features (transformations, positioning, etc.)
 * - You want partial camera following (Y-axis rotation only)
 * - You need to integrate with mesh-based workflows
 * - You require more control over geometry positioning and rotation
 *
 * **Use BillBoard when:**
 * - You need automatic full camera facing (all axes)
 * - You want simpler sprite-based rendering
 * - You need pixel-perfect dot-by-dot display with sizeAttenuation = false
 * - Performance is critical and you don't need mesh features
 *
 * ## Camera Chaser Functionality
 *
 * The integrated CameraChaser provides horizontal-only camera following:
 * - Rotates around Y-axis only (no X-axis or Z-axis rotation)
 * - Must be explicitly enabled via `cameraChaser.isLookingCameraHorizontal = true`
 * - Useful for UI elements or signs that should face the camera horizontally
 *
 * @example
 * ```typescript
 * // Create a basic plane billboard
 * const planeBillboard = new BillBoardPlane("./texture.png", 1.0);
 * scene.add(planeBillboard);
 *
 * // Enable horizontal camera chasing
 * planeBillboard.cameraChaser.isLookingCameraHorizontal = true;
 *
 * // Set custom scale
 * planeBillboard.imageScale = 0.01;
 *
 * // Create with custom texture filtering
 * const planeBillboard = new BillBoardPlane("./texture.png", 1.0, {
 *   minFilter: NearestFilter
 * });
 *
 * // Access mesh-specific features (transformations, positioning)
 * planeBillboard.position.y = 2.0;
 * planeBillboard.rotation.z = Math.PI / 4;
 * ```
 */
export class BillBoardPlane extends Mesh {
  /**
   * Internal controller that manages billboard functionality.
   */
  private obj: BillBoardController;

  /**
   * Camera chaser instance that provides optional horizontal camera following.
   * Set `isLookingCameraHorizontal = true` to enable camera chasing.
   */
  public cameraChaser: CameraChaser;

  /**
   * Creates a new BillBoardPlane instance.
   *
   * The constructor initializes the plane billboard synchronously, but texture loading
   * is performed asynchronously. The plane will be initially invisible and become
   * visible once the texture loads successfully.
   *
   * A CameraChaser instance is automatically created but must be manually enabled
   * by setting `isLookingCameraHorizontal = true`.
   *
   * @param url - URL of the texture image file to load
   * @param imageScale - Initial scale factor for the image
   * @param option - Optional configuration for texture filtering and other settings
   * @example
   * ```typescript
   * // Basic usage
   * const plane = new BillBoardPlane("./image.png", 1.0);
   *
   * // With camera chasing enabled
   * const plane = new BillBoardPlane("./image.png", 1.0);
   * plane.cameraChaser.isLookingCameraHorizontal = true;
   * ```
   */
  constructor(url: string, imageScale: number, option?: BillBoardOptions) {
    super();
    const initializedOption = BillBoardOptionUtil.init(option);
    this.obj = new BillBoardController(
      this,
      url,
      imageScale,
      initializedOption,
    );
    this.cameraChaser = new CameraChaser(this);
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
   * ## Scale Factor Behavior for Mesh Objects
   *
   * For BillBoardPlane (Mesh-based), the scale factor is applied directly to the object's
   * scale property. The PlaneGeometry is created with pixel dimensions, and the scale
   * factor modifies the overall size.
   *
   * - **Scale = 1.0**: The plane size matches the source image pixel dimensions directly
   * - **Scale = 0.5**: The plane becomes half the pixel dimensions
   * - **Scale = 2.0**: The plane becomes twice the pixel dimensions
   *
   * @param value - The scale factor to apply to the image
   * @example
   * ```typescript
   * // Scale to 50% of original pixel dimensions
   * planeBillboard.imageScale = 0.5;
   *
   * // Direct pixel-to-unit mapping (64px image = 64 units)
   * planeBillboard.imageScale = 1.0;
   *
   * // Set appropriate scale for scene
   * planeBillboard.imageScale = 0.01;
   * ```
   */
  set imageScale(value: number) {
    this.obj.imageScale = value;
  }
}
