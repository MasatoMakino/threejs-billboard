import { BillboardPlane, BillBoardPlane } from "../src/index.js";
import { billboardCommonTest } from "./BillboardObject3D.js";
import { describe, it, expect } from "vitest";
import { TestImage } from "./TestImage.js";
describe("BillboardPlane", () => {
  billboardCommonTest(new BillboardPlane(TestImage, 1));

  it("should export deprecated BillBoardPlane class (will be removed when compatibility checks are no longer needed)", () => {
    expect(BillBoardPlane).toBeDefined();
    expect(typeof BillBoardPlane).toBe("function");
  });
});
