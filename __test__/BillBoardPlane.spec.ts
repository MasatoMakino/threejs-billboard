import { BillBoardPlane, BillboardPlane } from "../src/index.js";
import { billboardCommonTest } from "./BillBoardObject3D.js";
import { describe, it, expect } from "vitest";
import { TestImage } from "./TestImage.js";
describe("BillBoardPlane", () => {
  billboardCommonTest(new BillBoardPlane(TestImage, 1));

  it("should export new BillboardPlane class (will be removed when compatibility checks are no longer needed)", () => {
    expect(BillboardPlane).toBeDefined();
    expect(typeof BillboardPlane).toBe("function");
  });
});
