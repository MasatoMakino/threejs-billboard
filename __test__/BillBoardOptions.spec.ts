import { BillBoardOptionUtil } from "../src";
import { LinearFilter } from "three";

describe("BillBoardOptions", () => {
  test("init", () => {
    const options = BillBoardOptionUtil.init(undefined);
    expect(options.minFilter).toBe(LinearFilter);
  });
});
