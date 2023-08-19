import { CameraChaser } from "../src";
import { Object3D, PerspectiveCamera } from "three";

describe("CameraChaser", () => {
  test("constructor", () => {
    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);
    expect(cameraChaser).not.toBeUndefined();
    expect(target.onBeforeRender).not.toBeUndefined();
  });

  test("lookCamera", () => {
    const camera = new PerspectiveCamera(45, 1, 1, 1000);
    camera.position.set(0, 10, 10);
    const target = new Object3D();
    const cameraChaser = new CameraChaser(target);
    cameraChaser.isLookingCameraHorizontal = true;
    cameraChaser.needUpdateWorldPosition = true;
    target.onBeforeRender(
      undefined,
      undefined,
      camera,
      undefined,
      undefined,
      undefined,
    );

    expect(target.rotation.x).toBeCloseTo(0);
    expect(target.rotation.y).toBeCloseTo(0);
    expect(target.rotation.z).toBeCloseTo(0);

    camera.position.set(10, 0, 10);
    target.onBeforeRender(
      undefined,
      undefined,
      camera,
      undefined,
      undefined,
      undefined,
    );
    expect(target.rotation.x).toBeCloseTo(0);
    expect(target.rotation.y).toBeCloseTo(Math.PI / 4);
    expect(target.rotation.z).toBeCloseTo(0);
  });
});
