import { BillboardOptionUtil, BillBoardOptionUtil } from "../src/index.js";
import { LinearFilter } from "three";
import { describe, expect, test } from "vitest";

describe("BillboardOptions", () => {
  test("should initialize default Billboard options with LinearFilter for lightweight performance", () => {
    const options = BillboardOptionUtil.init(undefined);
    expect(options.minFilter).toBe(LinearFilter);
  });

  // Discard condition: maintainer decision (2025-07) keeps the BillBoard* names as deprecated aliases of Billboard*, with no removal date set. Delete this test when the aliases are removed.
  test("keeps `BillBoardOptionUtil` as an alias of `BillboardOptionUtil` so that code written for the old name still runs", () => {
    expect(BillBoardOptionUtil).toBe(BillboardOptionUtil);
  });
});
