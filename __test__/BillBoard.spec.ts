import { BillBoard } from "../src";

describe("Billboard", () => {
  test("constructor", () => {
    const billboard = new BillBoard("../demoSrc/map01.png", 1);
    expect(billboard).not.toBeUndefined();
    expect(billboard.imageScale).toBe(1);
  });

  test("set imageScale", () => {
    const billboard = new BillBoard("../demoSrc/map01.png", 1);
    billboard.imageScale = 2;
    expect(billboard.imageScale).toBe(2);
  });
});
