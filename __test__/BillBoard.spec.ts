import { BillBoard } from "../src";
import { billboardCommonTest } from "./BillBoardObject3D";

describe("Billboard", () => {
  billboardCommonTest(new BillBoard("../demoSrc/map01.png", 1));
});
