import { Application, type Container, Ticker } from "pixi.js";
import { type BufferGeometry, type Material, Texture } from "three";

/**
 * Manages a single shared Canvas and Texture for use with SharedStageBillboard and SharedStagePlaneMesh classes.
 *
 * This class extends Three.js Texture and contains a PixiJS Application instance, using its Canvas
 * as the texture source. Multiple SharedStage class instances can reference this single texture
 * and display different content by adjusting their UV coordinates.
 *
 * ## Architecture Overview
 *
 * SharedStageTexture provides a shared texture system where:
 * - **Single Canvas**: One PixiJS canvas serves multiple billboard instances
 * - **UV Mapping**: Each billboard displays a specific region via UV coordinates
 * - **Manual Updates**: Texture updates must be explicitly triggered
 * - **Draw Call Reduction**: Significantly reduces draw calls compared to individual textures
 *
 * ## Comparison with MultiView Classes
 *
 * **SharedStageTexture Approach:**
 * - Single shared Canvas and Texture across multiple instances
 * - Excellent for reducing draw calls with fixed number of billboards
 * - Limited by total texture size constraints
 * - Requires UV coordinate management
 *
 * **MultiView Approach:**
 * - Each instance has independent Canvas using PixiJS v8 multiView
 * - Superior for partial updates and flexible billboard count
 * - Higher draw call count but more flexible
 *
 * ## Performance Characteristics
 *
 * **Advantages:**
 * - Reduced draw calls when using multiple billboards
 * - Shared material instances possible
 * - Efficient for static or infrequently updated content
 *
 * **Limitations:**
 * - Texture size constraints limit maximum billboard count
 * - Full texture re-render required for any content change
 * - More complex UV coordinate management
 *
 * ## Update Mechanism
 *
 * **Important**: Textures are not automatically updated by default. Billboard or PlaneMesh
 * instances using this texture must call `setNeedUpdate()` to trigger texture updates.
 *
 * @example
 * ```typescript
 * // Create and initialize shared texture
 * const sharedTexture = new SharedStageTexture();
 * await sharedTexture.init(1024, 1024);
 *
 * // Create shared material
 * const sharedMaterial = new SpriteMaterial({
 *   map: sharedTexture,
 *   transparent: true
 * });
 *
 * // Create billboards that share the texture
 * const billboard1 = new SharedStageBillboard(
 *   sharedMaterial,
 *   { x: 0, y: 0, width: 256, height: 256 }
 * );
 * const billboard2 = new SharedStageBillboard(
 *   sharedMaterial,
 *   { x: 256, y: 0, width: 256, height: 256 }
 * );
 *
 * // Add PixiJS content to shared stage
 * const sprite = new PIXI.Sprite(texture);
 * sharedTexture.stage.addChild(sprite);
 *
 * // Trigger texture update
 * sharedTexture.setNeedUpdate();
 * ```
 */
export class SharedStageTexture extends Texture {
  /**
   * The PixiJS Application instance that manages the shared canvas.
   * Provides access to the renderer, stage, and other PixiJS functionality.
   */
  readonly app: Application;

  /**
   * Internal flag indicating whether the stage needs re-rendering on the next frame.
   * Set to true by setNeedUpdate() and reset after rendering.
   */
  #_needsUpdateStage = false;

  /**
   * Creates a new SharedStageTexture instance.
   *
   * Initializes the Three.js Texture and creates a PixiJS Application instance.
   * The Application must be initialized separately using the init() method.
   *
   * @example
   * ```typescript
   * const sharedTexture = new SharedStageTexture();
   * await sharedTexture.init(1024, 1024);
   * ```
   */
  constructor() {
    super();
    this.app = new Application();
    this.colorSpace = "srgb";
  }

  /**
   * Initializes the PixiJS Application instance for shared texture use.
   *
   * This method must be called before using the SharedStageTexture. It configures
   * the PixiJS Application with the specified dimensions and sets up the render loop
   * integration with Three.js.
   *
   * @param width - Texture width in pixels (power-of-2 recommended for optimal performance)
   * @param height - Texture height in pixels (power-of-2 recommended for optimal performance)
   *
   * @example
   * ```typescript
   * const sharedTexture = new SharedStageTexture();
   *
   * // Initialize with power-of-2 dimensions for best performance
   * await sharedTexture.init(1024, 1024);
   *
   * // Or use non-power-of-2 if needed
   * await sharedTexture.init(800, 600);
   * ```
   */
  async init(width: number, height: number) {
    await this.app.init({
      autoStart: false,
      backgroundAlpha: 0.0,
      width,
      height,
    });
    this.image = this.app.canvas;
    Ticker.shared.add(this.onRequestFrame);
  }

  /**
   * Gets the PixiJS Container that serves as the root stage for content.
   *
   * All PixiJS display objects should be added to this stage to appear in the
   * shared texture. The stage coordinates range from (0,0) to (width,height).
   *
   * @returns The root PixiJS Container for adding display objects
   *
   * @example
   * ```typescript
   * // Add PixiJS content to the shared stage
   * const sprite = new PIXI.Sprite(texture);
   * sprite.position.set(100, 100);
   * sharedTexture.stage.addChild(sprite);
   *
   * // Add graphics
   * const graphics = new PIXI.Graphics();
   * graphics.rect(0, 0, 200, 200).fill(0xff0000);
   * sharedTexture.stage.addChild(graphics);
   * ```
   */
  public get stage(): Container {
    return this.app.stage;
  }

  /**
   * Gets the actual width of the shared texture.
   *
   * @returns The texture width in pixels
   */
  override get width(): number {
    return this.app.renderer.width;
  }

  /**
   * Gets the actual height of the shared texture.
   *
   * @returns The texture height in pixels
   */
  override get height(): number {
    return this.app.renderer.height;
  }

  /**
   * Marks the texture for update on the next render frame.
   *
   * This method must be called whenever the PixiJS stage content changes and you want
   * the changes to be reflected in the Three.js texture. The actual texture update
   * will occur on the next animation frame to optimize performance.
   *
   * @example
   * ```typescript
   * // Modify PixiJS content
   * sprite.position.x += 10;
   * graphics.tint = 0x00ff00;
   *
   * // Mark for update
   * sharedTexture.setNeedUpdate();
   *
   * // The texture will be updated on the next frame automatically
   * ```
   */
  public setNeedUpdate(): void {
    this.#_needsUpdateStage = true;
  }

  /**
   * Internal frame callback that handles texture updates.
   *
   * This method is automatically called by the PixiJS ticker when a texture update
   * is needed. It renders the PixiJS stage to the canvas and marks the Three.js
   * texture for update.
   *
   * **Note**: This is an internal method and should not be called directly.
   * Use setNeedUpdate() to trigger texture updates instead.
   */
  private onRequestFrame = () => {
    if (!this.#_needsUpdateStage) return;
    this.app.render();
    this.needsUpdate = true;
    this.#_needsUpdateStage = false;
  };

  /**
   * Calculate UV coordinates for the given texture area.
   * Returns normalized coordinates where (0,0) is bottom-left and (1,1) is top-right,
   * following Three.js texture coordinate conventions.
   *
   * @param rect - The texture area to calculate UV coordinates for
   * @returns UV coordinates object with x1,y1 (top-left) and x2,y2 (bottom-right)
   *
   * @example
   * ```typescript
   * const textureArea = { x: 0, y: 0, width: 256, height: 256 };
   * const uv = sharedTexture.calculateUV(textureArea);
   * // uv.x1, uv.y1 = top-left corner
   * // uv.x2, uv.y2 = bottom-right corner
   * console.log(uv); // { x1: 0, y1: 0.75, x2: 0.25, y2: 1 }
   * ```
   */
  public calculateUV(rect: TextureArea): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } {
    return {
      x1: rect.x / this.width,
      y1: (this.height - rect.y - rect.height) / this.height,
      x2: (rect.x + rect.width) / this.width,
      y2: (this.height - rect.y) / this.height,
    };
  }

  /**
   * @deprecated Use calculateUV instead. This method name contains a typo and will be removed in a future version.
   * Calculate UV coordinates for the given texture area.
   * Returns normalized coordinates where (0,0) is bottom-left and (1,1) is top-right,
   * following Three.js texture coordinate conventions.
   *
   * @param rect - The texture area to calculate UV coordinates for
   * @returns UV coordinates object with x1,y1 (top-left) and x2,y2 (bottom-right)
   */
  public calcurateUV(rect: TextureArea): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } {
    return this.calculateUV(rect);
  }
}

/**
 * Type guard function to check if a material uses SharedStageTexture.
 *
 * This utility function helps ensure type safety when working with materials
 * that should contain a SharedStageTexture as their map property.
 *
 * @param material - The Three.js material to check
 * @returns True if the material has a SharedStageTexture map, false otherwise
 *
 * @example
 * ```typescript
 * if (isSharedStageMaterial(material)) {
 *   // TypeScript now knows material.map is SharedStageTexture
 *   material.map.setNeedUpdate();
 *   const uv = material.map.calculateUV(textureArea);
 * }
 * ```
 */
export const isSharedStageMaterial = (
  material: Material,
): material is ISharedStageMaterial => {
  return "map" in material && material.map instanceof SharedStageTexture;
};

/**
 * Updates the UV attributes of a geometry to display a specific area of the shared texture.
 *
 * This utility function modifies the UV coordinates of a BufferGeometry to map a rectangular
 * area of the SharedStageTexture to the geometry's surface. The UV coordinates are calculated
 * automatically and applied to the geometry's UV attribute.
 *
 * **Important**: This function assumes the geometry has a standard quad UV layout with 4 vertices.
 *
 * @param geometry - The BufferGeometry whose UV coordinates will be updated
 * @param material - The material that must contain a SharedStageTexture
 * @param textureArea - The rectangular area of the texture to display
 *
 * @throws {Error} If the material does not contain a SharedStageTexture
 *
 * @example
 * ```typescript
 * // Create geometry and material
 * const geometry = new PlaneGeometry(1, 1);
 * const material = new MeshBasicMaterial({ map: sharedTexture });
 *
 * // Define the area to display (256x256 pixels at position 0,0)
 * const textureArea = { x: 0, y: 0, width: 256, height: 256 };
 *
 * // Update UV coordinates
 * updateUVAttribute(geometry, material, textureArea);
 *
 * // Create mesh
 * const mesh = new Mesh(geometry, material);
 * ```
 */
export const updateUVAttribute = (
  geometry: BufferGeometry,
  material: Material,
  textureArea: TextureArea,
): void => {
  if (!isSharedStageMaterial(material)) {
    throw new Error("sharedMaterial.map must be SharedStageTexture");
  }
  const area = material.map.calculateUV(textureArea);
  const uv = geometry.getAttribute("uv");
  uv.setXY(0, area.x1, area.y2);
  uv.setXY(1, area.x2, area.y2);
  uv.setXY(2, area.x1, area.y1);
  uv.setXY(3, area.x2, area.y1);
  uv.needsUpdate = true;
};

/**
 * Defines a rectangular area within a texture using pixel coordinates.
 *
 * This interface represents a rectangular region of a SharedStageTexture
 * that will be displayed on a billboard or plane mesh. Coordinates use
 * a standard 2D coordinate system with (0,0) at the top-left.
 *
 * @example
 * ```typescript
 * // Define a 256x256 area starting at position (100, 50)
 * const textureArea: TextureArea = {
 *   x: 100,
 *   y: 50,
 *   width: 256,
 *   height: 256
 * };
 *
 * // Use with SharedStageBillboard
 * const billboard = new SharedStageBillboard(sharedMaterial, textureArea);
 * ```
 */
export interface TextureArea {
  /** X coordinate of the top-left corner in pixels */
  x: number;
  /** Y coordinate of the top-left corner in pixels */
  y: number;
  /** Width of the area in pixels */
  width: number;
  /** Height of the area in pixels */
  height: number;
}

/**
 * Type interface that guarantees a material has a SharedStageTexture as its map.
 *
 * This interface extends the base Three.js Material interface to ensure type safety
 * when working with materials that must contain a SharedStageTexture. It's used
 * internally by the isSharedStageMaterial type guard and related utility functions.
 *
 * @example
 * ```typescript
 * function processSharedMaterial(material: ISharedStageMaterial) {
 *   // TypeScript knows material.map is definitely a SharedStageTexture
 *   material.map.setNeedUpdate();
 *   const width = material.map.width;
 *   const height = material.map.height;
 * }
 * ```
 */
export interface ISharedStageMaterial extends Material {
  /** The SharedStageTexture used as the material's map */
  map: SharedStageTexture;
}
