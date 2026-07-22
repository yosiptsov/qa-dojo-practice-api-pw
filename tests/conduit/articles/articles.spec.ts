import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import { TAG } from "../../../app/conduit/tags/tags";
import { newArticle, updatedArticle } from "./articles.data";
import { ArticleResponseSchema } from "../../../app/conduit/json-schemas/Articles";

test.describe("Article CRUD for a new user:", { tag: [TAG.authorized, TAG.article, TAG.crud] }, () => {
  test.use({
    isNeedToCreateUser: true, // create a new user and authorize him
  });

  test("A new user should be able to create an article |L18:t1|", async ({ apiController }) => {
    /* Arrange
     1. user will be created in fixture.
     2. user login will be done in fixture
     3. Object article is prepared the .data.ts file 
    */

    // ACT
    const createArticle = await test.step("Create an article", async () => {
      const createArticle = await apiController.articleController.createArticle(newArticle, false);
      return createArticle;
    });

    // Assert
    await test.step("check the response status is 200", () => {
      expect(createArticle.response.status()).toBe(200);
      expect(createArticle.response.statusText()).toBe("OK");
    });

    await test.step("JSON schema matches ZOD template", () => {
      const data = ArticleResponseSchema.safeParse(createArticle.json);
      expect(data.success, { message: data.error?.message }).toBeTruthy();
    });

    await test.step("correct headers", () => {
      const headers = createArticle.response.headers();
      expect.soft(headers["content-type"]).toContain("application/json");
    });

    await test.step("new article fields equal to input values", () => {
      expect.soft(createArticle.json.article.title, "title is correct").toBe(newArticle.article.title);
      expect
        .soft(createArticle.json.article.description, "description is correct")
        .toBe(newArticle.article.description);
      expect.soft(createArticle.json.article.body, "body is correct").toBe(newArticle.article.body);
      expect.soft(createArticle.json.article.tagList, "tagList is correct").toStrictEqual(["yo", "books"]);
    });

    await test.step("new article author is equal the current user", async () => {
      const currentUserName = (await apiController.userController.getCurrentUser()).json.user.username;
      expect(createArticle.json.article.author.username, "author name is correct").toBe(currentUserName);
    });
  });
});

test.describe("Article CRUD for an existing user:", { tag: [TAG.authorized, TAG.user] }, () => {
  test.use({
    isNeedToCreateUser: false, // use an existing user, don't create a new one
    isAuthorized: true, // authorize existing user
  });

  test("An existing user should be able to create an article |L18:t2|", async ({ apiController }) => {
    /* Arrange
     1. user will be created in fixture.
     2. user login will be done in fixture
     3. Object article is prepared the .data.ts file 
    */
    // ACT
    const createArticle = await test.step("Create an article", async () => {
      const createArticle = await apiController.articleController.createArticle(newArticle, false);
      return createArticle;
    });

    // Assert
    await test.step("check the response status is 200", () => {
      expect(createArticle.response.status()).toBe(200);
      expect(createArticle.response.statusText()).toBe("OK");
    });

    await test.step("JSON schema matches ZOD template", () => {
      const data = ArticleResponseSchema.safeParse(createArticle.json);
      expect(data.success, { message: data.error?.message }).toBeTruthy();
    });

    await test.step("correct headers", () => {
      const headers = createArticle.response.headers();
      expect.soft(headers["content-type"]).toContain("application/json");
    });

    await test.step("new article fields equal to input values", () => {
      expect.soft(createArticle.json.article.title, "title is correct").toBe(newArticle.article.title);
      expect
        .soft(createArticle.json.article.description, "description is correct")
        .toBe(newArticle.article.description);
      expect.soft(createArticle.json.article.body, "body is correct").toBe(newArticle.article.body);
      expect.soft(createArticle.json.article.tagList, "tagList is correct").toStrictEqual(["yo", "books"]);
    });

    await test.step("new article author is equal the current user", async () => {
      const currentUserName = (await apiController.userController.getCurrentUser()).json.user.username;
      expect(createArticle.json.article.author.username, "author name is correct").toBe(currentUserName);
    });
  });
});

test.describe("<Negative> Article CRUD for unauthorized user:", { tag: [TAG.authorized, TAG.nonAuthRequests] }, () => {
  test.use({
    isNeedToCreateUser: false, // don't create a new user
    isAuthorized: false, // don't authorize user
  });

  test("Unauthorized user should not be able to create an article |L18:t3|", async ({ apiController }) => {
    /* Arrange
     1. user will be created in fixture.
     2. user login will be done in fixture
     3. Object article is prepared the .data.ts file 
    */
    // ACT
    const createArticle = await test.step("Create an article", async () => {
      const createArticle = await apiController.articleController.createArticle(newArticle, false);
      return createArticle;
    });

    // Assert
    await test.step("check the response status is 401", () => {
      expect(createArticle.response.status()).toBe(401);
      expect(createArticle.response.statusText()).toBe("Unauthorized");
    });
  });
});
