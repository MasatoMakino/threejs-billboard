import { PixiMultiViewManager } from "./PixiMultiViewManager";

export interface MultiViewPixiObjectOptions {
  manager: PixiMultiViewManager;
  width: number;
  height: number;
  scale?: number; // 省略可能
}
