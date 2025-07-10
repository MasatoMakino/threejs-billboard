import {
  type BufferGeometry,
  type Camera,
  type Material,
  type Object3D,
  type Scene,
  Vector3,
  type WebGLRenderer,
} from "three";

/**
 * Provides horizontal-only camera following functionality for Three.js objects.
 *
 * CameraChaser enables objects to rotate around the Y-axis to face the camera horizontally,
 * while maintaining their vertical orientation. This is particularly useful for UI elements,
 * signs, or billboards that should face the camera but remain upright.
 *
 * ## Key Features
 *
 * - **Y-axis rotation only**: Objects rotate left/right to face camera, but stay upright
 * - **Optional activation**: Camera chasing must be explicitly enabled
 * - **Automatic integration**: Works with Three.js render loop via onBeforeRender
 * - **Resource management**: Proper cleanup to avoid memory leaks
 *
 * ## Usage with Billboard Classes
 *
 * CameraChaser is automatically integrated with mesh-based billboard classes such as
 * BillBoardPlane, SharedStagePlaneMesh, and MultiViewPixiPlaneMesh. For full camera
 * facing on all axes, use the BillBoard class (Sprite-based) instead.
 *
 * ## Important Limitations
 *
 * - **Y-axis rotation only**: No X-axis or Z-axis rotation
 * - **Gimbal lock potential**: Rapid rotation when camera crosses object's poles
 * - **Camera height restrictions**: Best to limit camera's Y movement for smooth rotation
 *
 * @example
 * ```typescript
 * // Usage with BillBoardPlane
 * const planeBillboard = new BillBoardPlane("./texture.png", 1.0);
 * planeBillboard.cameraChaser.isLookingCameraHorizontal = true;
 *
 * // Usage with SharedStagePlaneMesh
 * const sharedPlane = new SharedStagePlaneMesh(sharedMaterial, textureArea, 1.0);
 * sharedPlane.cameraChaser.isLookingCameraHorizontal = true;
 *
 * // Usage with MultiViewPixiPlaneMesh
 * const multiViewPlane = new MultiViewPixiPlaneMesh(multiViewOptions);
 * multiViewPlane.cameraChaser.isLookingCameraHorizontal = true;
 *
 * // Manual usage with any Object3D
 * const mesh = new Mesh(geometry, material);
 * const chaser = new CameraChaser(mesh);
 * chaser.isLookingCameraHorizontal = true;
 *
 * // Don't forget to dispose when done
 * chaser.dispose();
 * ```
 */
export class CameraChaser {
  /**
   * Controls whether horizontal camera following is enabled.
   *
   * When set to `true`, the target object will rotate around the Y-axis to face
   * the camera horizontally on each frame. When `false`, no rotation occurs.
   *
   * @default false
   * @example
   * ```typescript
   * // Enable camera chasing
   * cameraChaser.isLookingCameraHorizontal = true;
   *
   * // Disable camera chasing
   * cameraChaser.isLookingCameraHorizontal = false;
   * ```
   */
  public isLookingCameraHorizontal = false;

  /**
   * Cached camera position vector used for lookAt calculations.
   * Reused to avoid creating new Vector3 instances each frame.
   */
  private cameraPos: Vector3 = new Vector3();

  /**
   * Cached world position of the target object.
   * Updated when needUpdateWorldPosition is true.
   */
  private worldPos: Vector3 = new Vector3();

  /**
   * Reference to the target object being controlled.
   * Set to undefined when disposed.
   */
  private target: Object3D | undefined;

  /**
   * Backup of the original onBeforeRender function.
   * Restored when the CameraChaser is disposed.
   */
  private originalOnBeforeRender;

  /**
   * Flag indicating whether the world position cache needs updating.
   *
   * Set this to `true` if the target object's position has changed and you want
   * the camera chaser to recalculate the world position on the next frame.
   * Automatically reset to `false` after the update.
   *
   * @example
   * ```typescript
   * // After moving the object
   * object.position.set(10, 0, 5);
   * cameraChaser.needUpdateWorldPosition = true;
   * ```
   */
  public needUpdateWorldPosition = false;

  /**
   * Creates a new CameraChaser instance for the specified target object.
   *
   * The constructor automatically hooks into the target's onBeforeRender callback
   * to perform camera following calculations. The original onBeforeRender function
   * is preserved and can be restored via the dispose method.
   *
   * @param target - The Three.js object that should follow the camera
   * @example
   * ```typescript
   * const mesh = new Mesh(geometry, material);
   * const chaser = new CameraChaser(mesh);
   *
   * // Enable camera following
   * chaser.isLookingCameraHorizontal = true;
   *
   * // Add to scene
   * scene.add(mesh);
   * ```
   */
  constructor(target: Object3D) {
    this.target = target;
    this.target.getWorldPosition(this.worldPos);
    this.originalOnBeforeRender = this.target.onBeforeRender;
    this.target.onBeforeRender = this.lookCamera;
  }

  /**
   * Releases resources and restores the target object's original state.
   *
   * This method should be called when the CameraChaser is no longer needed
   * to prevent memory leaks and restore the target's original onBeforeRender
   * function. After calling dispose, the CameraChaser instance should not be used.
   *
   * @example
   * ```typescript
   * // Clean up when removing from scene
   * scene.remove(mesh);
   * cameraChaser.dispose();
   *
   * // Or when switching camera chasing off permanently
   * cameraChaser.dispose();
   * ```
   */
  dispose(): void {
    if (this.target) {
      this.target.onBeforeRender = this.originalOnBeforeRender;
      this.target = undefined;
    }
  }

  /**
   * Internal method that performs the camera following rotation.
   *
   * This method is automatically called during Three.js render loop via the
   * target's onBeforeRender callback. It rotates the target object around the
   * Y-axis to face the camera horizontally while maintaining vertical orientation.
   *
   * ## Rotation Behavior
   *
   * - Only Y-axis rotation is applied (horizontal facing)
   * - The target's Y position is used as the rotation axis
   * - Camera's Y position is projected onto the target's horizontal plane
   *
   * ## Performance Considerations
   *
   * - Executes every frame when enabled
   * - Uses cached Vector3 instances to minimize allocations
   * - Early exit when camera chasing is disabled
   *
   * ## Known Issues
   *
   * - Rapid rotation can occur when camera crosses the target's poles (directly above/below)
   * - Consider limiting camera's Y movement range for smoother behavior
   *
   * @param _render - WebGL renderer (unused)
   * @param _scene - Scene being rendered (unused)
   * @param camera - Camera used for rendering
   * @param _geometry - Target's geometry (unused)
   * @param _material - Target's material (unused)
   * @param _group - Parent group (unused)
   */
  private lookCamera = (
    _render: WebGLRenderer,
    _scene: Scene,
    camera: Camera,
    _geometry: BufferGeometry,
    _material: Material,
    _group: Object3D,
  ) => {
    if (!this.isLookingCameraHorizontal || !this.target) return;

    if (this.needUpdateWorldPosition) {
      this.target.getWorldPosition(this.worldPos);
      this.needUpdateWorldPosition = false;
    }

    // Project camera position onto target's horizontal plane (same Y level)
    this.cameraPos.set(camera.position.x, this.worldPos.y, camera.position.z);
    this.target.lookAt(this.cameraPos);
  };
}
