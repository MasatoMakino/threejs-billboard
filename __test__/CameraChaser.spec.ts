import { CameraChaser } from "../src/index.js";
import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { describe, expect, test } from "vitest";

describe("CameraChaser", () => {
  test("constructor", () => {
    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);
    expect(cameraChaser).not.toBeUndefined();
    expect(target.onBeforeRender).not.toBeUndefined();
  });

  test("lookCamera", () => {
    const camera = new PerspectiveCamera(45, 1, 1, 1000);

    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);
    cameraChaser.isLookingCameraHorizontal = true;
    cameraChaser.needUpdateWorldPosition = true;

    const testRotation = (cameraPosition: Vector3, rotation: Vector3) => {
      camera.position.copy(cameraPosition);

      target.onBeforeRender(
        // @ts-ignore
        undefined,
        undefined,
        camera,
        undefined,
        undefined,
        undefined,
      );
      expect(target.rotation.x).toBeCloseTo(rotation.x);
      expect(target.rotation.y).toBeCloseTo(rotation.y);
      expect(target.rotation.z).toBeCloseTo(rotation.z);
    };

    testRotation(new Vector3(0, 0, 10), new Vector3(0, 0, 0));
    testRotation(new Vector3(10, 0, 10), new Vector3(0, Math.PI / 4, 0));
  });
});
