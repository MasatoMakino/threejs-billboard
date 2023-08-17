import { BillBoardPlane } from "../src";

describe("BillBoardPlane", () => {
  test("constructor", () => {
    const plane = new BillBoardPlane("../demoSrc/map01.png", 1);
    expect(plane).not.toBeUndefined();
    expect(plane.imageScale).toBe(1);
  });

  test("set imageScale", () => {
    const plane = new BillBoardPlane("../demoSrc/map01.png", 1);
    plane.imageScale = 2;
    expect(plane.imageScale).toBe(2);
  });
});
