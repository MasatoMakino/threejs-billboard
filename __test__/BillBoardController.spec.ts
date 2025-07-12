import {
  BillBoardController,
  type BillBoardObject3D,
} from "../src/BillBoardController.js";
import { Mesh, Sprite } from "three";
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
});
