import { BillBoardOptionUtil } from "../src/index.js";
import { LinearFilter } from "three";
import { describe, expect, test } from "vitest";

describe("BillBoardOptions", () => {
  test("should initialize default BillBoard options with LinearFilter for lightweight performance", () => {
    const options = BillBoardOptionUtil.init(undefined);
    expect(options.minFilter).toBe(LinearFilter);
  });
});
