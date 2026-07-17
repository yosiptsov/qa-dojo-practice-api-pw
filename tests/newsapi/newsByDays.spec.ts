import { test } from "./fixtures";

test("Get some news, auth trough the fixture", async ({ request }) => {
  const url = "/v2/everything";
  const response = await request.get(url, {
    failOnStatusCode: true,
    params: {
      q: "FIFA",
      from: "2026-07-16",
    },
  });
  const json = await response.json();
  console.log(json);
});
