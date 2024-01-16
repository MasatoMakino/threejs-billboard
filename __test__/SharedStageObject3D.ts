import { SharedStageBillboard, SharedStagePlaneMesh } from "src";
import { expect } from "vitest";

export const textureArea = {
  x: 0,
  y: 0,
  width: 32,
  height: 32,
} as const;

type SharedStageObject3D = SharedStageBillboard | SharedStagePlaneMesh;

export const testUpdateTextureAreaAndUV = (object3D: SharedStageObject3D) => {
  const area = {
    ...textureArea,
    width: 16,
    height: 16,
  };
  object3D.updateTextureAreaAndUV(area);
  expect(object3D.cloneTextureArea()).toEqual(area);
};
