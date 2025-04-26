import { Container } from "pixi.js";
import { MeshBasicMaterial, SpriteMaterial } from "three";

type MaterialType = MeshBasicMaterial | SpriteMaterial;

export class MultiViewObject3DUtils {
  static disposeMaterials(materials: MaterialType | MaterialType[]): void {
    if (!Array.isArray(materials)) {
      materials = [materials];
    }
    for (const material of materials) {
      if (material.map) {
        material.map.dispose();
      }
      material.dispose();
    }
  }

  static disposeStageContainer(container: Container): void {
    if (container) {
      container.removeFromParent();
      container.removeChildren();
      container.destroy({ children: true });
    }
  }

  static disposeCanvas(canvas: HTMLCanvasElement): void {
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }
}
