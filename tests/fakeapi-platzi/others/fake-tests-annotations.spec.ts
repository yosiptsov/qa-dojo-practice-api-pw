import { test, expect } from "@playwright/test";
import { TAG } from "../../../app/fakeapi-platzi/tags/tags";

test.describe("Fake tests to see how test annotations work", { tag: TAG.annotations }, () => {
  test.skip("This test should be skipped - |test id: L13:t1|", async ({}) => {
    expect(3).toBe(3);
  });

  test.fixme("This test should be skipped - waiting for fix - |test id: L13:t2|", async ({}) => {
    expect(3).toBe(3);
  });

  test.fail("This test should allow failure - |test id: L13:t3|", async ({}) => {
    test.fail();
    console.log("This test should allow failure");
    expect(2).toBe(3);
  });

  test("This test should have increased timeouts - |test id: L13:t4|", async ({}) => {
    test.slow();
    expect(3).toBe(3);
  });
});
