import { Billboard, BillBoard } from "../src/index.js";
import { billboardCommonTest } from "./BillboardObject3D.js";
import { describe, it, expect } from "vitest";

describe("Billboard", () => {
  billboardCommonTest((url, imageScale) => new Billboard(url, imageScale));

  // Discard condition: maintainer decision (2025-07) keeps the BillBoard* names as deprecated aliases of Billboard*, with no removal date set. Delete this test when the aliases are removed.
  it("keeps `BillBoard` as an alias of `Billboard` so that code written for the old name still runs", () => {
    expect(BillBoard).toBe(Billboard);
  });
});
