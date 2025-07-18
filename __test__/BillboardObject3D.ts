import type { Billboard, BillboardPlane } from "../src/index.js";
import { expect, test } from "vitest";

export const billboardCommonTest = (target: Billboard | BillboardPlane) => {
  test("should update imageScale property and maintain correct scaling behavior", () => {
    expect(target).not.toBeUndefined();
    expect(target.imageScale).toBe(1);

    target.imageScale = 2;
    expect(target.imageScale).toBe(2);
  });
};
