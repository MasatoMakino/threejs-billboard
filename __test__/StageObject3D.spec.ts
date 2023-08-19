import { StageBillBoard, StageTexture } from "../src";

describe("StageObject3D", () => {
  test("switch visible", () => {
    const stageBillBoard = new StageBillBoard(16, 18);
    const map = stageBillBoard.material.map as StageTexture;

    stageBillBoard.setVisible(false);
    expect(stageBillBoard.visible).toBe(false);
    expect(map.isStarted).toBe(false);

    stageBillBoard.setVisible(true);
    expect(stageBillBoard.visible).toBe(true);
    expect(map.isStarted).toBe(true);
  });
});
