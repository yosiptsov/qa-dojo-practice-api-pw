import { test } from "./fixture";
import { expect } from "@playwright/test";

// env types validation using ZOD
import { envConduit } from "../../../envValidation";

test.describe("Not Authorized requests example", () => {
  test.use({
    isAuthorized: false,
    userEmail: envConduit.CONDUIT_ADMIN_EMAIL,
    userPass: envConduit.CONDUIT_ADMIN_PASS,
  });

  test("Using option isAuthorized = False  |id: L15:t3|", async ({ request }) => {
    const response = await request.get("/api/user/", {
      failOnStatusCode: false,
    });
    expect(response.status(), "It should return 401 because request is NOT authorized").toBe(401);
  });
});

test.describe("Authorized requests example", () => {
  test.use({
    isAuthorized: true,
    userEmail: envConduit.CONDUIT_ADMIN_EMAIL,
    userPass: envConduit.CONDUIT_ADMIN_PASS,
  });

  test("Using option isAuthorized = True |id: L15:t4|", async ({ request }) => {
    const response = await request.get("/api/user/", {
      failOnStatusCode: true,
    });
    console.log(response);
  });
});
