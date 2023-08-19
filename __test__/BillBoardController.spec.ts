import { BillBoardController } from "../src/BillBoardController";
import { Mesh, Sprite } from "three";
import { BillBoardOptionUtil } from "../src";

describe("BillBoardController", () => {
  test("constructor : Mesh", async () => {
    const controller = new BillBoardController(
      new Mesh(),
      "https://masatomakino.github.io/threejs-billboard/demo/map01.png",
      1,
      BillBoardOptionUtil.init(undefined),
    );
    expect(controller).not.toBeUndefined();

    await expect(controller.textureLoaderPromise).resolves.toBeUndefined();
  });

  test("constructor : Sprite", async () => {
    const controller = new BillBoardController(
      new Sprite(),
      "https://masatomakino.github.io/threejs-billboard/demo/map01.png",
      1,
      BillBoardOptionUtil.init(undefined),
    );
    expect(controller).not.toBeUndefined();

    await expect(controller.textureLoaderPromise).resolves.toBeUndefined();
  });

  test("constructor : error", async () => {
    const mockError = jest.spyOn(console, "error").mockImplementation((x) => x);

    const controller = new BillBoardController(
      new Mesh(),
      "not exist url",
      1,
      BillBoardOptionUtil.init(undefined),
    );
    expect(controller).not.toBeUndefined();

    await expect(controller.textureLoaderPromise).rejects.toMatchObject({
      isTrusted: true,
    });

    mockError.mockRestore();
  });
});
