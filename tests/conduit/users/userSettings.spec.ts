import { test } from "../fixtures/fixtures";
import { expect } from "@playwright/test";
import { TAG } from "../../../app/conduit/tags/tags";
import { faker } from "@faker-js/faker";
import { UserUpdateResponse } from "../../../app/conduit/json-schemas/Users";

test.describe("Conduit user settings update for a new user:", { tag: [TAG.authorized, TAG.user] }, () => {
  test.use({
    isNeedToCreateUser: true, // create a new user and authorize him
  });

  test("Authorized created user should be able to update it's BIO |L15:t1|", async ({ apiController }) => {
    // Arrange
    // user will be created in fixture
    const bio: string = `Updated BIO - The last book I read was: ${faker.book.title()}`;
    // ACT
    const updatedUser = await test.step("Update the created user BIO", async () => {
      const updatedUser = await apiController.userController.updateUser({ bio }, false);
      return updatedUser;
    });
    // Assert
    const userJson = updatedUser.json as UserUpdateResponse;

    await test.step("check the response status is 200", () => {
      expect(updatedUser.response.status()).toBe(200);
      expect(updatedUser.response.statusText()).toBe("OK");
    });
    await test.step("field BIO has been updated", () => {
      expect(userJson.user.bio).toBe(bio);
    });
  });
});

test.describe("Conduit user settings update for an existing user:", { tag: [TAG.authorized, TAG.user] }, () => {
  test.use({
    isNeedToCreateUser: false, // use an existing user, don't create a new one
    isAuthorized: true, // authorize existing user
  });

  test("Authorized existing user should be able to update it's BIO |L15:t2|", async ({ apiController }) => {
    // Arrange
    const bio: string = `Updated BIO - The last book I read was: ${faker.book.title()}`;
    // ACT
    const updatedUser = await test.step("Update the created user BIO", async () => {
      const updatedUser = await apiController.userController.updateUser({ bio }, false);
      return updatedUser;
    });
    // Assert
    const userJson = updatedUser.json as UserUpdateResponse;

    await test.step("check the response status is 200", () => {
      expect(updatedUser.response.status()).toBe(200);
      expect(updatedUser.response.statusText()).toBe("OK");
    });
    await test.step("field BIO has been updated", () => {
      expect(userJson.user.bio).toBe(bio);
    });
  });
});

test.describe("Conduit user settings update for unauthorized user", { tag: [TAG.authorized, TAG.user] }, () => {
  test.use({
    isNeedToCreateUser: false, // don't create a new user
    isAuthorized: false, // don't authorize user
  });

  test("Unauthorized user should NOT be able to update it's BIO |L15:t3|", async ({ apiController }) => {
    // Arrange
    const bio: string = `Updated BIO - The last book I read was: ${faker.book.title()}`;
    // ACT
    const updatedUser = await test.step("Update the created user BIO", async () => {
      const updatedUser = await apiController.userController.updateUser({ bio }, false);
      return updatedUser;
    });
    // Assert
    await test.step("response status is 401", () => {
      expect(updatedUser.response.status(), "Check status").toBe(401);
      expect(updatedUser.response.statusText(), "Check status message").toBe("Unauthorized");
    });
  });
});
