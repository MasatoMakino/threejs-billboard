import { StagePlaneMesh } from "../src/index.js";

describe("StagePlaneMesh", () => {
  test("constructor", () => {
    const plane = new StagePlaneMesh(16, 18);
    expect(plane).not.toBeUndefined();
    expect(plane.stage).not.toBeUndefined();
    expect(plane.cameraChaser).not.toBeUndefined();
  });
});
