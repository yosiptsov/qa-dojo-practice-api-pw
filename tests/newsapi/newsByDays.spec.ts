import { test } from "./fixtures";
// helpers
import { searchNewsByParams } from "../../app/newsapi/utils/searchNews";
// tags
import { TAG } from "../../app/newsapi/tags/tags";
// test data
import { searchParams } from "./newsByDays.data";

//test.describe("Endpoint /v2/everything123:", { tag: [TAG.news, TAG.search] }, () => {
// test("Get new by params", { tag: [] }, async ({ request }) => {
//   // Arrange
//   // Act
//   const allArticles = await test.step("Get list of all articles", async () => {
//     const allArticles = await searchNewsByParams(request, "FIFA");
//     return allArticles;
//   });
//   console.log(allArticles.json);
//   // Assert
// });

for (const { day, title, date, expectLength, expectPublishedDate } of searchParams) {
  test(`Should return all articles published at ${day} - ${date}`, async ({ request }) => {
    const allArticles = await test.step("Get all articles", async ({}) => {
      const from = String(date);
      const to = String(date);
      const allArticles = await searchNewsByParams(request, title, from, to);
      return allArticles.json;
    });
    console.log(allArticles);
  });
}
//});
