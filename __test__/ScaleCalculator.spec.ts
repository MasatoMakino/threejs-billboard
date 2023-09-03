import { ScaleCalculator } from "../src";
import { PerspectiveCamera } from "three";

describe("ScaleCalculator", () => {
  test("get scale", () => {
    const H = 480;
    const W = 640;
    const camera = new PerspectiveCamera(45, W / H, 1, 400);
    camera.position.set(0, 0, 100);
    const scale = ScaleCalculator.getNonAttenuateScale(H, camera);
    expect(scale).toBeCloseTo(0.0017258898432212294);
  });
});