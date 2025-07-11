import { type PerspectiveCamera, MathUtils } from "three";

/**
 * Utility for calculating billboard scale values based on camera and renderer parameters.
 *
 * This utility provides methods to achieve pixel-perfect rendering for billboards,
 * particularly when working with Sprite objects that have `sizeAttenuation = false`.
 * The calculations ensure that billboard pixels map directly to screen pixels regardless
 * of the camera's distance from the billboard.
 *
 * ## Mathematical Background
 *
 * The scale calculation is based on the relationship between:
 * - Camera's field of view (FOV)
 * - Renderer canvas height in pixels
 * - Distance from camera to billboard
 *
 * For pixel-perfect rendering, the scale factor must compensate for the perspective
 * projection to ensure that one unit in Three.js coordinate space equals one pixel
 * on the screen at a given distance.
 *
 * @example
 * ```typescript
 * // Set up pixel-perfect billboard rendering
 * const billboard = new BillBoard("./texture.png", 1.0);
 * const scale = ScaleCalculator.getNonAttenuateScale(renderer.domElement.height, camera);
 * billboard.imageScale = scale;
 * billboard.material.sizeAttenuation = false; // Required!
 *
 * // The billboard will now display at exactly the pixel size of the source image
 * ```
 */
export const ScaleCalculator = {
  /**
   * Calculates the scale value for Sprite objects with `sizeAttenuation = false`.
   *
   * This method computes the appropriate scale factor to achieve pixel-perfect rendering
   * where the billboard's size on screen matches exactly with the source image's pixel
   * dimensions, regardless of camera distance.
   *
   * ## Prerequisites
   *
   * - The Sprite material must have `sizeAttenuation = false`
   * - The billboard should be positioned at distance 1.0 from the camera for optimal results
   * - The camera should be a PerspectiveCamera (OrthographicCamera not supported)
   *
   * ## Scale Factor Calculation
   *
   * The scale factor is calculated as:
   * `scale = visibleHeight / rendererHeight`
   *
   * Where `visibleHeight` is the height of the view frustum at distance 1.0 unit from the camera.
   *
   * ## Important Note on Device Pixel Ratio
   *
   * This method **does not consider devicePixelRatio**. It calculates the scale based solely
   * on the rendered canvas height and camera settings. If your application uses high-DPI
   * displays with devicePixelRatio > 1, you may need to adjust the calculation separately.
   *
   * @param rendererHeight - Height of the rendered canvas in pixels (not physical device pixels)
   * @param camera - The perspective camera used for rendering
   * @returns Scale factor to apply to the billboard for pixel-perfect rendering
   *
   * @example
   * ```typescript
   * // Basic usage
   * const scale = ScaleCalculator.getNonAttenuateScale(
   *   renderer.domElement.height,
   *   camera
   * );
   *
   * // Apply to billboard
   * billboard.imageScale = scale;
   * billboard.material.sizeAttenuation = false;
   *
   * // For a 64x64 pixel image, the billboard will appear exactly 64x64 pixels on screen
   * ```
   */
  getNonAttenuateScale(
    rendererHeight: number,
    camera: PerspectiveCamera,
  ): number {
    return getFovHeight(1.0, camera) / rendererHeight;
  },
};

/**
 * Calculates the visible height of the view frustum at a given distance from the camera.
 *
 * This helper function computes the height of the viewing area (in Three.js coordinate units)
 * that is visible at the specified distance from a perspective camera. The calculation is
 * based on the camera's field of view and uses basic trigonometry.
 *
 * ## Mathematical Formula
 *
 * ```
 * height = 2 * distance * tan(fov / 2)
 * ```
 *
 * Where:
 * - `distance` is the distance from camera to the plane
 * - `fov` is the camera's field of view in radians
 * - `tan` is the tangent function
 *
 * @param distance - Distance from the camera to the viewing plane (in Three.js units)
 * @param camera - The perspective camera
 * @returns The height of the visible area at the specified distance
 *
 * @example
 * ```typescript
 * // Calculate visible height at distance 5 units from camera
 * const visibleHeight = getFovHeight(5.0, camera);
 *
 * // For a camera with 75° FOV at distance 5.0:
 * // visibleHeight ≈ 7.32 units
 * ```
 */
const getFovHeight = (distance: number, camera: PerspectiveCamera): number => {
  const halfFov = MathUtils.degToRad(camera.fov / 2);
  const half_fov_height = Math.tan(halfFov) * distance;
  return half_fov_height * 2;
};
