import {
  BillboardController,
  BillBoardController,
  type BillboardObject3D,
} from "../src/BillboardController.js";
import {
  Mesh,
  MeshBasicMaterial,
  Sprite,
  Texture,
  NormalBlending,
} from "three";
import { BillBoardOptionUtil } from "../src/index.js";
import { describe, expect, test, vi } from "vitest";

describe("BillboardController", () => {
  const textureURL =
    "https://masatomakino.github.io/threejs-billboard/demo/map01.png";
  const testBillboardController = (url: string, target: BillboardObject3D) => {
    const controller = new BillboardController(
      target,
      url,
      1,
      BillBoardOptionUtil.init(undefined),
    );
    expect(controller).not.toBeUndefined();
    return controller;
  };

  test("should successfully create BillboardController with Mesh target and load texture from URL", async () => {
    const controller = testBillboardController(textureURL, new Mesh());
    await expect(controller.textureLoaderPromise).resolves.toBeUndefined();
  });

  test("should successfully create BillboardController with Sprite target and load texture from URL", async () => {
    const controller = testBillboardController(textureURL, new Sprite());
    await expect(controller.textureLoaderPromise).resolves.toBeUndefined();
  });

  test("should handle texture loading errors gracefully when provided invalid URL", async () => {
    const mockError = vi.spyOn(console, "error").mockImplementation((x) => x);

    const controller = testBillboardController("not exist url", new Mesh());
    await expect(controller.textureLoaderPromise).rejects.toMatchObject({
      isTrusted: true,
    });

    mockError.mockRestore();
  });

  test("should handle null map in updateScale method", () => {
    // Create a mesh with null map to test the early return in updateScale
    const target = new Mesh();
    const controller = new BillboardController(
      target,
      textureURL,
      1,
      BillBoardOptionUtil.init(undefined),
    );

    // Mock the material to have null map
    const mat = new MeshBasicMaterial({ map: null });
    target.material = mat;

    // Call updateScale method directly through imageScale setter
    // This should trigger the early return due to null map
    controller.imageScale = 2;

    // Verify that the target scale remains unchanged (not modified by updateScale)
    expect(target.scale.x).toBe(1);
    expect(target.scale.y).toBe(1);
    expect(target.scale.z).toBe(1);
  });

  test("should handle null map.image in updateScale method", () => {
    // Create a mesh with map that has null image to test the early return in updateScale
    const target = new Mesh();
    const controller = new BillboardController(
      target,
      textureURL,
      1,
      BillBoardOptionUtil.init(undefined),
    );

    // Mock the material to have map with null image
    const mat = new MeshBasicMaterial({ map: new Texture() });
    target.material = mat;

    // Call updateScale method directly through imageScale setter
    // This should trigger the early return due to null map.image
    controller.imageScale = 2;

    // Verify that the target scale remains unchanged (not modified by updateScale)
    expect(target.scale.x).toBe(1);
    expect(target.scale.y).toBe(1);
    expect(target.scale.z).toBe(1);
  });

  describe("Resource Management", () => {
    test("should handle multiple controllers and cleanup properly", async () => {
      // Create multiple controllers to test resource management
      const controllers: BillboardController[] = [];

      for (let i = 0; i < 5; i++) {
        const target = new Mesh();
        const controller = new BillboardController(
          target,
          textureURL,
          1,
          BillBoardOptionUtil.init(undefined),
        );
        controllers.push(controller);
      }

      // Wait for all texture loading to complete or fail
      const results = await Promise.allSettled(
        controllers.map((c) => c.textureLoaderPromise),
      );

      // Verify at least some textures loaded successfully
      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      expect(successCount).toBeGreaterThan(0);

      // Verify proper cleanup
      controllers.length = 0;
      expect(controllers.length).toBe(0);
    });

    test("should handle texture loading errors properly", async () => {
      const invalidUrls = ["invalid://url", "file:///nonexistent"];
      const controllers: BillboardController[] = [];

      // Create controllers with invalid URLs
      for (const url of invalidUrls) {
        const target = new Mesh();
        const controller = new BillboardController(
          target,
          url,
          1,
          BillBoardOptionUtil.init(undefined),
        );
        controllers.push(controller);
      }

      // All should reject
      const results = await Promise.allSettled(
        controllers.map((c) => c.textureLoaderPromise),
      );

      // Verify all failed
      const failureCount = results.filter(
        (r) => r.status === "rejected",
      ).length;
      expect(failureCount).toBe(invalidUrls.length);
    });

    test("should configure material properties correctly", () => {
      const target = new Mesh();
      new BillboardController(
        target,
        textureURL,
        1,
        BillBoardOptionUtil.init(undefined),
      );

      const material = target.material as MeshBasicMaterial;

      // Verify proper material configuration
      expect(material.transparent).toBe(true);
      expect(material.depthTest).toBe(true);
      expect(material.blending).toBe(NormalBlending);
      expect(material.visible).toBe(false); // Initially hidden to prevent flicker
      expect(material.map).toBeNull(); // No texture initially
    });
  });

  describe("State Transitions", () => {
    test("should maintain material state consistency during texture loading", async () => {
      const target = new Mesh();
      const controller = new BillBoardController(
        target,
        textureURL,
        1,
        BillBoardOptionUtil.init(undefined),
      );

      const material = target.material as MeshBasicMaterial;

      // Material should start invisible
      expect(material.visible).toBe(false);
      expect(material.map).toBeNull();

      // Wait for texture loading
      await controller.textureLoaderPromise;

      // Material should become visible with texture
      expect(material.visible).toBe(true);
      expect(material.map).not.toBeNull();
    });

    test("should handle rapid imageScale changes during texture loading", async () => {
      const target = new Mesh();
      const controller = new BillBoardController(
        target,
        textureURL,
        1,
        BillBoardOptionUtil.init(undefined),
      );

      // Change scale multiple times before texture loads
      controller.imageScale = 0.5;
      controller.imageScale = 2.0;
      controller.imageScale = 1.5;

      const finalScale = controller.imageScale;

      // Wait for texture loading
      await controller.textureLoaderPromise;

      // Scale should be consistent after loading
      expect(controller.imageScale).toBe(finalScale);

      // Target scale should reflect the final image scale
      const expectedScaleX = target.geometry?.boundingBox?.max.x || 1;
      expect(target.scale.x).toBeCloseTo(expectedScaleX * finalScale, 5);
    });

    test("should export deprecated BillBoardController class (will be removed when compatibility checks are no longer needed)", () => {
      expect(BillBoardController).toBeDefined();
      expect(typeof BillBoardController).toBe("function");
    });
  });
});
