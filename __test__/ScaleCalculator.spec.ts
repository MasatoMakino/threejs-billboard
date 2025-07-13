import { ScaleCalculator } from "../src/index.js";
import { PerspectiveCamera } from "three";
import { describe, expect, test } from "vitest";

describe("ScaleCalculator", () => {
  test("should calculate correct non-attenuation scale for pixel-perfect rendering at given camera distance", () => {
    const H = 480;
    const W = 640;
    const camera = new PerspectiveCamera(45, W / H, 1, 400);
    camera.position.set(0, 0, 100);
    const scale = ScaleCalculator.getNonAttenuateScale(H, camera);
    expect(scale).toBeCloseTo(0.0017258898432212294);
  });
});
