import { StageBillBoard } from "../src/index.js";
import { describe, expect, test } from "vitest";

describe("StageBillBoard", () => {
  test("constructor", () => {
    const billboard = new StageBillBoard(16, 18);
    expect(billboard).not.toBeUndefined();
    expect(billboard.imageScale).toBe(1);
    expect(billboard.stage).not.toBeUndefined();
  });

  test("set imageScale", () => {
    const billboard = new StageBillBoard(16, 18);
    billboard.imageScale = 2;
    expect(billboard.imageScale).toBe(2);
  });
});
