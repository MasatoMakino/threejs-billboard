import type { Billboard, BillboardPlane } from "../src/index.js";
import { Texture } from "three";
import { expect, test } from "vitest";
import { TestImage } from "./TestImage.js";

type BillboardFactory = (
  url: string,
  imageScale: number,
) => Billboard | BillboardPlane;

export const billboardCommonTest = (create: BillboardFactory) => {
  test("keeps the material hidden until textureLoaderPromise resolves, so that an empty quad never flickers", async () => {
    const target = create(TestImage, 1);

    expect(target.material).toMatchObject({ visible: false, map: null });

    await target.textureLoaderPromise;

    expect(target.material).toMatchObject({
      visible: true,
      map: expect.any(Texture),
    });
  });

  test("rejects textureLoaderPromise and keeps the material hidden when the image fails to load, so that callers can handle a missing image", async () => {
    const target = create("./not-found.png", 1);

    await expect(target.textureLoaderPromise).rejects.toBeDefined();

    expect(target.material).toMatchObject({ visible: false, map: null });
  });

  test("applies the last imageScale set before the texture loads, so that early scale changes are not lost", async () => {
    const target = create(TestImage, 1);
    target.imageScale = 0.5;
    target.imageScale = 2.0;
    target.imageScale = 1.5;

    // A billboard created with the final scale gives the expected size without knowing the image size.
    const reference = create(TestImage, 1.5);

    await target.textureLoaderPromise;
    await reference.textureLoaderPromise;

    expect(target.scale.x).toBeCloseTo(reference.scale.x, 5);
    expect(target.scale.y).toBeCloseTo(reference.scale.y, 5);
  });
};
