import { StageTexture } from "../src";

describe("StageTexture", () => {
  test("constructor", () => {
    const texture = new StageTexture(100, 100);
    expect(texture).not.toBeUndefined();
  });
});
