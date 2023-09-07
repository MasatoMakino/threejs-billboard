import { BillBoard, BillBoardPlane } from "../src/index.js";

export const billboardCommonTest = (target: BillBoard | BillBoardPlane) => {
  test("change image scale", () => {
    expect(target).not.toBeUndefined();
    expect(target.imageScale).toBe(1);

    target.imageScale = 2;
    expect(target.imageScale).toBe(2);
  });
};
