import { BillBoard } from "../src/index.js";
import { billboardCommonTest } from "./BillBoardObject3D.js";

describe("Billboard", () => {
  billboardCommonTest(new BillBoard("../demoSrc/map01.png", 1));
});
