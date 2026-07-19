import { test } from "./fixture";
import { expect } from "@playwright/test";
import { TAG } from "../../../app/conduit/tags/tags";

// env types validation using ZOD
import { envConduit } from "../../../envValidation";

test.describe("Not Authorized requests example", { tag: [TAG.auth, TAG.nonAuthRequests] }, () => {
  test("Using not authorized fixture nonAuthRequest |id: L15:t1|", async ({ nonAuthRequest }) => {
    const response = await nonAuthRequest.get("/api/user/", {
      failOnStatusCode: false,
    });
    expect(response.status(), "It should return 401 because request is NOT authorized").toBe(401);
  });
});

test.describe("Authorized requests example", { tag: [TAG.auth, TAG.authorized] }, () => {
  test.use({
    userEmail: envConduit.CONDUIT_ADMIN_EMAIL,
    userPass: envConduit.CONDUIT_ADMIN_PASS,
  });

  test("Using authorized fixture request |id: L15:t2|", async ({ request }) => {
    const response = await request.get("/api/user/", {
      failOnStatusCode: true,
    });
    expect(response.status(), "It should return 200 because request is authorized").toBe(200);
  });
});
