import { Billboard, BillBoard } from "../src/index.js";
import { billboardCommonTest } from "./BillboardObject3D.js";
import { describe, it, expect } from "vitest";
import { TestImage } from "./TestImage.js";

describe("Billboard", () => {
  billboardCommonTest(new Billboard(TestImage, 1));

  it("should export deprecated BillBoard class (will be removed when compatibility checks are no longer needed)", () => {
    expect(BillBoard).toBeDefined();
    expect(typeof BillBoard).toBe("function");
  });
});
