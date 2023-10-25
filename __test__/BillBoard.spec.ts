import { BillBoard } from "../src/index.js";
import { billboardCommonTest } from "./BillBoardObject3D.js";
import { describe } from "vitest";
import { TestImage } from "./TestImage.js";

describe("Billboard", () => {
  billboardCommonTest(new BillBoard(TestImage, 1));
});
