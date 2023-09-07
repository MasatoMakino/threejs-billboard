import { BillBoardPlane } from "../src/index.js";
import { billboardCommonTest } from "./BillBoardObject3D.js";
describe("BillBoardPlane", () => {
  billboardCommonTest(new BillBoardPlane("../demoSrc/map01.png", 1));
});
