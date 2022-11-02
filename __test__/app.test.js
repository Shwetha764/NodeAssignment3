const { emptyUserChecker } = require("../app");

describe("User validation", () => {
   test("To check if entered value is a valid string", async () => {
     expect(emptyUserChecker("abc")).toEqual(true);
  });

  test("To check if entered value is an empty string", () => {
    expect(emptyUserChecker(" ")).toEqual(false);
  });
});