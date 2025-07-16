import { BillBoard, Billboard } from "../src/index.js";
import { billboardCommonTest } from "./BillboardObject3D.js";
import { describe, it, expect } from "vitest";
import { TestImage } from "./TestImage.js";

describe("Billboard", () => {
  billboardCommonTest(new BillBoard(TestImage, 1));

  it("should export new Billboard class (will be removed when compatibility checks are no longer needed)", () => {
    expect(Billboard).toBeDefined();
    expect(typeof Billboard).toBe("function");
  });
});
