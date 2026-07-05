import { test } from "@playwright/test";

test("Get some news, auth trough the fixture", async ({ request }) => {
  const url = "/v2/everything";
  const apiKey = process.env.NEWSAPI_API_KEY;
  const response = await request.get(url, {
    failOnStatusCode: true,
    params: {
      apiKey: `${apiKey}`,
      q: "Apple",
      from: "2026-07-01",
    },
  });
  const json = await response.json();
  console.log(json);
});
