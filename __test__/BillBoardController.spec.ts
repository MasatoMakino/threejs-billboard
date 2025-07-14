import {
  BillBoardController,
  type BillBoardObject3D,
} from "../src/BillBoardController.js";
import { Mesh, MeshBasicMaterial, Sprite, Texture } from "three";
import { BillBoardOptionUtil } from "../src/index.js";
import { describe, expect, test, vi } from "vitest";

describe("BillBoardController", () => {
  const textureURL =
    "https://masatomakino.github.io/threejs-billboard/demo/map01.png";
  const testBillBoardController = (url: string, target: BillBoardObject3D) => {
    const controller = new BillBoardController(
      target,
      url,
      1,
      BillBoardOptionUtil.init(undefined),
    );
    expect(controller).not.toBeUndefined();
    return controller;
  };

  test("should successfully create BillBoardController with Mesh target and load texture from URL", async () => {
    const controller = testBillBoardController(textureURL, new Mesh());
    await expect(controller.textureLoaderPromise).resolves.toBeUndefined();
  });

  test("should successfully create BillBoardController with Sprite target and load texture from URL", async () => {
    const controller = testBillBoardController(textureURL, new Sprite());
    await expect(controller.textureLoaderPromise).resolves.toBeUndefined();
  });

  test("should handle texture loading errors gracefully when provided invalid URL", async () => {
    const mockError = vi.spyOn(console, "error").mockImplementation((x) => x);

    const controller = testBillBoardController("not exist url", new Mesh());
    await expect(controller.textureLoaderPromise).rejects.toMatchObject({
      isTrusted: true,
    });

    mockError.mockRestore();
  });

  test("should handle null map in updateScale method", () => {
    // Create a mesh with null map to test the early return in updateScale
    const target = new Mesh();
    const controller = new BillBoardController(
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
    const controller = new BillBoardController(
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
});
