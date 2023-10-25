import { BillBoardPlane } from "../src/index.js";
import { billboardCommonTest } from "./BillBoardObject3D.js";
import { describe } from "vitest";
import { TestImage } from "./TestImage.js";
describe("BillBoardPlane", () => {
  billboardCommonTest(new BillBoardPlane(TestImage, 1));
});
