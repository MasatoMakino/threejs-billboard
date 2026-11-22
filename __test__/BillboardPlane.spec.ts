import { BillboardPlane, BillBoardPlane } from "../src/index.js";
import { billboardCommonTest } from "./BillboardObject3D.js";
import { describe, it, expect } from "vitest";

describe("BillboardPlane", () => {
  billboardCommonTest((url, imageScale) => new BillboardPlane(url, imageScale));

  // Discard condition: maintainer decision (2025-07) keeps the BillBoard* names as deprecated aliases of Billboard*, with no removal date set. Delete this test when the aliases are removed.
  it("keeps `BillBoardPlane` as an alias of `BillboardPlane` so that code written for the old name still runs", () => {
    expect(BillBoardPlane).toBe(BillboardPlane);
  });
});
