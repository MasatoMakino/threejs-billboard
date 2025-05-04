import type { PixiMultiViewManager } from "./PixiMultiViewManager";

export interface MultiViewPixiObjectOptions {
  manager: PixiMultiViewManager;
  width: number;
  height: number;
  scale?: number;
}
