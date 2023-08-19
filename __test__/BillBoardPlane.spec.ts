import { BillBoardPlane } from "../src";
import { billboardCommonTest } from "./BillBoardObject3D";
describe("BillBoardPlane", () => {
  billboardCommonTest(new BillBoardPlane("../demoSrc/map01.png", 1));
});
