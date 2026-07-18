import { test } from "./fixtures";
// helpers
import { searchNewsByParams } from "../../app/newsapi/utils/searchNews";
// tags
import { TAG } from "../../app/newsapi/tags/tags";
// test data
import { searchParams } from "./newsByDays.data";

test.describe("Endpoint /v2/everything:", { tag: [TAG.news, TAG.search] }, () => {
  for (const { day, title, date, expectLength, expectPublishedDate, expectDescription } of searchParams) {
    test(`should return an article with published at ${day} - ${date}`, async ({ request }) => {
      const allArticles = await test.step("Get all articles", async ({}) => {
        const allArticles = await searchNewsByParams(request, title, date, date);
        return allArticles.json;
      });
      test.step("Check the 1st article published date", async ({}) => {
        expectLength(allArticles);
        expectPublishedDate(allArticles);
      });
      test.step(`Check the 1st article description contains ${title}`, async ({}) => {
        expectDescription(allArticles);
      });
    });
  }
});
