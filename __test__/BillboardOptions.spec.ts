import { BillboardOptionUtil, BillBoardOptionUtil } from "../src/index.js";
import { LinearFilter } from "three";
import { describe, expect, test } from "vitest";

describe("BillboardOptions", () => {
  test("should initialize default Billboard options with LinearFilter for lightweight performance", () => {
    const options = BillboardOptionUtil.init(undefined);
    expect(options.minFilter).toBe(LinearFilter);
  });

  test("should export deprecated BillBoardOptionUtil (will be removed when compatibility checks are no longer needed)", () => {
    expect(BillBoardOptionUtil).toBeDefined();
    expect(typeof BillBoardOptionUtil).toBe("object");
  });
});
