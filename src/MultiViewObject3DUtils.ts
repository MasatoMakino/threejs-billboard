import type { Container } from "pixi.js";
import type { MeshBasicMaterial, SpriteMaterial } from "three";

/**
 * Type alias for materials that can be used with MultiView billboard objects.
 * Supports both MeshBasicMaterial for plane meshes and SpriteMaterial for sprites.
 */
type MaterialType = MeshBasicMaterial | SpriteMaterial;

/**
 * Utility collection for proper resource disposal in MultiView billboard systems.
 *
 * This utility object provides essential resource management functions for cleaning up
 * Three.js materials, PixiJS containers, and HTML canvas elements used by the MultiView
 * architecture. Proper disposal is critical to prevent memory leaks and ensure optimal
 * performance when working with dynamic billboard content.
 *
 * ## Resource Management Philosophy
 *
 * The MultiView architecture creates multiple independent canvas and texture resources
 * that must be properly cleaned up when no longer needed. This utility ensures that:
 * - Three.js materials and their textures are properly disposed
 * - PixiJS containers and their children are destroyed correctly
 * - HTML canvas elements are removed from the DOM
 *
 * ## Usage Context
 *
 * These utilities are primarily used by:
 * - MultiViewPixiBillboard and MultiViewPixiPlaneMesh classes during disposal
 * - PixiMultiViewManager for cleaning up managed instances
 * - Application code that needs to clean up billboard resources manually
 *
 * @example
 * ```typescript
 * // Clean up a MultiView billboard's resources
 * MultiViewObject3DUtils.disposeMaterials(billboard.material);
 * MultiViewObject3DUtils.disposeStageContainer(billboard._container);
 * MultiViewObject3DUtils.disposeCanvas(billboard.canvas);
 *
 * // Clean up multiple materials at once
 * MultiViewObject3DUtils.disposeMaterials([material1, material2, material3]);
 * ```
 */
export const MultiViewObject3DUtils = {
  /**
   * Disposes Three.js materials and their associated textures.
   *
   * This method properly cleans up both single materials and arrays of materials,
   * ensuring that all associated textures are also disposed. This is essential
   * for preventing memory leaks when working with dynamic billboard content.
   *
   * ## Disposal Process
   *
   * For each material:
   * 1. Checks if the material has a texture map
   * 2. Disposes the texture if present (releases GPU memory)
   * 3. Disposes the material itself (releases GPU resources)
   *
   * ## Important Notes
   *
   * - Materials that are still in use by other objects should not be disposed
   * - Textures shared between multiple materials will be disposed with the first material
   * - This method is safe to call multiple times on the same materials
   *
   * @param materials - Single material or array of materials to dispose
   *
   * @example
   * ```typescript
   * // Dispose a single material
   * MultiViewObject3DUtils.disposeMaterials(spriteMaterial);
   *
   * // Dispose multiple materials at once
   * const materials = [material1, material2, material3];
   * MultiViewObject3DUtils.disposeMaterials(materials);
   *
   * // Safe to call on materials that may be undefined
   * MultiViewObject3DUtils.disposeMaterials(billboard.material);
   * ```
   */
  disposeMaterials(materials: MaterialType | MaterialType[]): void {
    const materialArray = Array.isArray(materials) ? materials : [materials];
    for (const material of materialArray) {
      if (material.map) {
        material.map.dispose();
      }
      material.dispose();
    }
  },

  /**
   * Properly destroys a PixiJS Container and all its children.
   *
   * This method ensures complete cleanup of PixiJS display objects by removing
   * the container from its parent, clearing all children, and destroying the
   * container with recursive child destruction. This prevents memory leaks
   * and ensures all associated resources are freed.
   *
   * ## Destruction Process
   *
   * 1. Removes the container from its parent (if it has one)
   * 2. Removes all children from the container
   * 3. Destroys the container and all its children recursively
   *
   * ## Safety Features
   *
   * - Safe to call on null or undefined containers
   * - Automatically handles containers that are already destroyed
   * - Recursively destroys all child objects and their resources
   *
   * @param container - The PixiJS Container to destroy
   *
   * @example
   * ```typescript
   * // Destroy a MultiView billboard's container
   * MultiViewObject3DUtils.disposeStageContainer(billboard._container);
   *
   * // Safe to call on potentially undefined containers
   * MultiViewObject3DUtils.disposeStageContainer(billboard?._container);
   *
   * // Destroy a container with complex hierarchy
   * const complexContainer = new Container();
   * complexContainer.addChild(sprite1, sprite2, graphics);
   * MultiViewObject3DUtils.disposeStageContainer(complexContainer);
   * ```
   */
  disposeStageContainer(container: Container): void {
    if (container) {
      container.removeFromParent();
      container.removeChildren();
      container.destroy({ children: true });
    }
  },

  /**
   * Removes an HTML canvas element from the DOM.
   *
   * This method safely removes a canvas element from its parent node in the DOM,
   * which is important for cleaning up PixiJS Application instances that create
   * their own canvas elements. This prevents accumulation of unused canvas elements
   * in the DOM when MultiView instances are disposed.
   *
   * ## Removal Process
   *
   * 1. Checks if the canvas exists and has a parent node
   * 2. Removes the canvas from its parent using removeChild()
   * 3. Safely handles cases where the canvas is already removed
   *
   * ## Safety Features
   *
   * - Safe to call on null or undefined canvas elements
   * - Safe to call on canvas elements that are not in the DOM
   * - Uses optional chaining to prevent errors with missing parent nodes
   *
   * @param canvas - The HTML canvas element to remove from the DOM
   *
   * @example
   * ```typescript
   * // Remove a PixiJS Application's canvas from the DOM
   * MultiViewObject3DUtils.disposeCanvas(app.canvas);
   *
   * // Safe to call on potentially undefined canvas
   * MultiViewObject3DUtils.disposeCanvas(billboard.canvas);
   *
   * // Remove canvas created by MultiView billboard
   * const billboard = new MultiViewPixiBillboard(options);
   * // ... use billboard ...
   * MultiViewObject3DUtils.disposeCanvas(billboard.canvas);
   * ```
   */
  disposeCanvas(canvas: HTMLCanvasElement): void {
    if (canvas?.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  },
};
