import { test } from "./fixtures";
import { expect } from "@playwright/test";
import { TAG } from "../../app/newsapi/tags/tags";
import { NewsApiResponseSchema } from "../../app/newsapi/json-schemas/News";
import { searchNewsByParams } from "../../app/newsapi/utils/searchNews";

test.describe("Endpoint /v2/everything:", { tag: TAG.schema }, () => {
  test("response should match schema |id: L14:t1|", async ({ request }) => {
    //Arrange
    //Act
    const allArticles = await test.step("Get all articles", async ({}) => {
      const allArticles = await searchNewsByParams(request, "FIFA");
      return allArticles;
    });

    //Assert
    await test.step("response status is 200 / OK", () => {
      expect(allArticles.response.status()).toBe(200);
      expect(allArticles.response.statusText()).toBe("OK");
      expect(allArticles.json.status).toBe("ok");
    });

    await test.step("JSON schema matches ZOD template", () => {
      const data = NewsApiResponseSchema.safeParse(allArticles.json);
      expect(data.success, { message: data.error?.message }).toBeTruthy();
    });

    await test.step("correct headers", () => {
      const headers = allArticles.response.headers();
      expect.soft(headers["content-type"]).toContain("application/json");
      expect.soft(headers["server"]).toBe("cloudflare");
      expect.soft(headers["cf-ray"]).not.toBeNull;
      expect.soft(headers["x-cached-result"]).toBe("true");
    });
  });
});
