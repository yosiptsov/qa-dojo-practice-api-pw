import { test, expect } from "@playwright/test";
import { TAG } from "../../../app/fakeapi-platzi/tags/tags";

test.describe("Fake tests to see how test annotations work", { tag: TAG.annotations }, () => {
  test.skip("|test id: L12:t0| - This test should be skipped", async ({}) => {
    expect(3).toBe(3);
  });

  test.fixme("|test id: L12:t1| - This test should be skipped - waiting for fix", async ({}) => {
    expect(3).toBe(3);
  });

  test.fail("|test id: L12:t2| - This test should allow failure", async ({}) => {
    test.fail();
    console.log("This test should allow failure");
    expect(2).toBe(3);
  });

  test("|test id: L12:t3| - This test should have increased timeouts", async ({}) => {
    test.slow();
    expect(3).toBe(3);
  });
});
