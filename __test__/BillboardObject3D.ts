import type { Billboard, BillboardPlane } from "../src/index.js";
import { Texture } from "three";
import { expect, test, vi } from "vitest";
import { TestImage } from "./TestImage.js";

type BillboardFactory = (
  url: string,
  imageScale: number,
) => Billboard | BillboardPlane;

const waitForTexture = (target: Billboard | BillboardPlane) =>
  vi.waitFor(() => {
    expect(target.material).toMatchObject({ visible: true });
  });

export const billboardCommonTest = (create: BillboardFactory) => {
  test("keeps the material hidden until the texture loads, so that an empty quad never flickers", async () => {
    const target = create(TestImage, 1);

    expect(target.material).toMatchObject({ visible: false, map: null });

    await waitForTexture(target);

    expect(target.material).toMatchObject({
      visible: true,
      map: expect.any(Texture),
    });
  });

  test("applies the last imageScale set before the texture loads, so that early scale changes are not lost", async () => {
    const target = create(TestImage, 1);
    target.imageScale = 0.5;
    target.imageScale = 2.0;
    target.imageScale = 1.5;

    // A billboard created with the final scale gives the expected size without knowing the image size.
    const reference = create(TestImage, 1.5);

    await waitForTexture(target);
    await waitForTexture(reference);

    expect(target.scale.x).toBeCloseTo(reference.scale.x, 5);
    expect(target.scale.y).toBeCloseTo(reference.scale.y, 5);
  });
};
