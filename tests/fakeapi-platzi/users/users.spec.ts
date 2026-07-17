import { expect } from "@playwright/test";
// fixture prepares test data: newUser, Updated user
import { test } from "./fixtures";
// schema
import {
  UserResponseSchema,
  UserListResponseSchema,
  UserNotFoundSchema,
  UserResponse,
} from "../../../app/fakeapi-platzi/json-schemas/Users";
// helpers CRUD
import { createUser, readUsers, updateUser } from "../../../app/fakeapi-platzi/utils/users/users-crud";
// tags from enum
import { TAG } from "../../../app/fakeapi-platzi/tags/tags";

test.describe("Verification of endpoint /api/v1/users", { tag: TAG.users }, () => {
  test.describe("CRUD and schema validation: ", { tag: [TAG.crud, TAG.schemaValidation, TAG.positive] }, () => {
    test("POST - Create a user, response should have: - |test id: L13-3:t1|", async ({ request, requestData }) => {
      //Arrange
      //Act
      const createdUser = await test.step("Create a new user", async () => {
        const createdUser = await createUser(request, requestData.newUser);
        return createdUser;
      });
      //Assert
      await test.step("response status is 201 / Created", () => {
        expect(createdUser.response.status()).toBe(201);
        expect(createdUser.response.statusText()).toBe("Created");
      });

      await test.step("JSON schema matches ZOD template", () => {
        const data = UserResponseSchema.safeParse(createdUser.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("correct headers", () => {
        const headers = createdUser.response.headers();
        expect.soft(headers["content-type"]).toContain("application/json");
        expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
        expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
        expect.soft(headers["content-security-policy"]).toContain("base-uri");
      });

      await test.step("keys and values equal to input values", () => {
        expect(createdUser.json).toMatchObject({
          id: expect.any(Number),
          name: requestData.newUser.name,
          password: requestData.newUser.password,
          email: requestData.newUser.email,
          avatar: requestData.newUser.avatar,
        });
      });
    });

    test("GET - response for all users should have: |test id: L13-3:t2|", async ({ request, requestData }) => {
      //Arrange
      const createdUser = await test.step("Create a new user", async () => {
        const createdUser = await createUser(request, requestData.newUser);
        return createdUser;
      });
      //Act
      const allUsersList = await test.step("Get list of all users", async () => {
        const allUsersList = await readUsers(request);
        return allUsersList;
      });
      //Assert
      await test.step("response status is 201 / OK", () => {
        expect(allUsersList.response.status()).toBe(200);
        expect(allUsersList.response.statusText()).toBe("OK");
      });

      await test.step("JSON schema matches ZOD template", async () => {
        const data = UserListResponseSchema.safeParse(allUsersList.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("correct headers", () => {
        const headers = allUsersList.response.headers();
        expect.soft(headers["content-type"]).toContain("application/json");
        expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
        expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
        expect.soft(headers["content-security-policy"]).toContain("base-uri");
      });

      await test.step("contains just added user", async () => {
        const allUsersArray = allUsersList.json;
        if (Array.isArray(allUsersArray)) {
          const foundUser = allUsersArray.find((elem) => elem.id === createdUser.json.id);
          expect(foundUser).toBeDefined();
        }
      });

      await test.step("all users have role defined, one of customer | admin", async () => {
        const allUsersArray = allUsersList.json;
        if (Array.isArray(allUsersArray)) {
          for (const user of allUsersArray) {
            expect(["customer", "admin"]).toContain(user.role);
          }
        }
      });
    });

    test("GET {id} - for one user by ID response should: |test id: L13-3:t3|", async ({ request, requestData }) => {
      //Arrange
      const createdUser = await test.step("Create a new user", async () => {
        const createdUser = await createUser(request, requestData.newUser);
        return createdUser;
      });
      //Act
      const getCreatedUser = await test.step("Get created user", async () => {
        const getCreatedUser = await readUsers(request, createdUser.json.id);
        return getCreatedUser;
      });

      // using toPass - let's imaging the user is created asynchronously by some worker which works with a queue
      // ! this block is only to try to use expect().toPass. It's returned value is not used in further tests.
      // ? Зробив через Step щоб це повертало значення. Також складно працювати з типами, треба костилі в вигляді '!'.
      const getCreatedUserToPassFromTestStep = await test.step("Get created user using toPass", async () => {
        let getCreatedUserToPass: UserResponse | undefined;
        await expect(async () => {
          const getCreatedUser = await readUsers(request, createdUser.json.id, false); // false - turns failOnStatusCode off to get a possible error here
          expect(getCreatedUser.response.status()).toBe(200);

          getCreatedUserToPass = getCreatedUser.json as UserResponse;
        }).toPass({
          timeout: 5_000,
          intervals: [3_000, 5_000, 10_000],
        });
        expect(getCreatedUserToPass!).toBeDefined();
        return getCreatedUserToPass!;
      });
      console.log("getCreatedUserToPassFromTestStep", getCreatedUserToPassFromTestStep);

      //Assert
      await test.step("response status is 201 / OK", () => {
        expect(getCreatedUser.response.status()).toBe(200);
        expect(getCreatedUser.response.statusText()).toBe("OK");
      });

      await test.step("JSON schema matches ZOD template", async () => {
        const data = UserResponseSchema.safeParse(getCreatedUser.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("correct headers", () => {
        const headers = getCreatedUser.response.headers();
        expect.soft(headers["content-type"]).toContain("application/json");
        expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
        expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
        expect.soft(headers["content-security-policy"]).toContain("base-uri");
      });

      await test.step("all fields of gotten user are equal to created", () => {
        expect(getCreatedUser.json).toMatchObject({
          id: createdUser.json.id,
          name: requestData.newUser.name,
          password: requestData.newUser.password,
          email: requestData.newUser.email,
          avatar: requestData.newUser.avatar,
        });
      });
    });

    test("PUT {id} - request should update only field 'role' |L13-3:t4|", async ({ request, requestData }) => {
      //Arrange
      const createdUser = await test.step("Create a new user", async () => {
        const createdUser = await createUser(request, requestData.newUser);
        return createdUser;
      });
      //Act
      const updatedUser = await test.step("Update created user", async () => {
        const updatedUser = await updateUser(request, createdUser.json.id, { role: "customer" }, false);
        return updatedUser;
      });
      //Assert
      await test.step("response status is 200 / OK", () => {
        expect(updatedUser.response.status()).toBe(200);
        expect(updatedUser.response.statusText()).toBe("OK");
      });

      await test.step("JSON schema matches ZOD template", async () => {
        const data = UserResponseSchema.safeParse(updatedUser.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("correct headers", () => {
        const headers = updatedUser.response.headers();
        expect.soft(headers["content-type"]).toContain("application/json");
        expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
        expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
        expect.soft(headers["content-security-policy"]).toContain("base-uri");
      });

      await test.step("only field 'role' was updated", () => {
        expect(updatedUser.json).toMatchObject({
          id: createdUser.json.id,
          name: createdUser.json.name,
          password: createdUser.json.password,
          email: createdUser.json.email,
          avatar: createdUser.json.avatar,
          role: "customer",
        });
      });
    });
  });

  test.describe("Negative tests for all HTTP methods", { tag: [TAG.negative, TAG.schemaValidation] }, () => {
    test("GET request should return 400 / Bad Request for a non-existent User ID - |test id: L13-3:t5|", async ({
      request,
    }) => {
      //Arrange
      const nonExistentUserId = 99999999;
      //Act
      const tryToGetAUser = await test.step("trying to get a user with a non-existent User ID", async () => {
        const tryToGetAUser = await readUsers(request, nonExistentUserId, false); //send with func attr failOnStatusCode = false to get an error
        return tryToGetAUser;
      });
      //Assert
      await test.step("response status is 400 / Bad request", () => {
        expect(tryToGetAUser.response.status()).toBe(400);
        expect(tryToGetAUser.response.statusText()).toBe("Bad Request");
      });

      await test.step("JSON schema matches ZOD template", async () => {
        const data = UserNotFoundSchema.safeParse(tryToGetAUser.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("Error name and message match the error", () => {
        expect(tryToGetAUser.json).toMatchObject({
          name: "EntityNotFoundError",
          message: expect.stringContaining(
            `Could not find any entity of type \"User\" matching: {\n    \"id\": ${nonExistentUserId}\n}`,
          ),
        });
      });
    });

    test("PUT request should return 400 / Bad Request for a non-existent User ID - |test id: L13-3:t6|", async ({
      request,
      requestData,
    }) => {
      //Arrange
      const nonExistentUserId = 99999999;
      //Act
      const updatedUser = await test.step("trying to update a user by a non-existent User ID", async () => {
        const updatedUser = await updateUser(request, nonExistentUserId, { any: "field" }, false); // 'false' to turn failOnStatusCode off.
        return updatedUser;
      });
      //Assert
      await test.step("response status is 400 / Bad request", () => {
        expect(updatedUser.response.status()).toBe(400);
        expect(updatedUser.response.statusText()).toBe("Bad Request");
      });

      await test.step("JSON schema matches ZOD template", async () => {
        const data = UserNotFoundSchema.safeParse(updatedUser.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("Error name and message match the error", () => {
        expect(updatedUser.json).toMatchObject({
          name: "EntityNotFoundError",
          message: expect.stringContaining(
            `Could not find any entity of type \"User\" matching: {\n    \"id\": ${nonExistentUserId}\n}`,
          ),
        });
      });
    });

    // ! SKIP this test for now: currently, it's allowed to create several users with the same email. This should be fixed.
    test.fixme("POST request should return an error if email is not unique: - |test id: L13-3:t7|", async ({
      request,
      requestData,
    }) => {
      //Arrange
      const createdUser1 = await test.step("Create a first user", async () => {
        const createdUser1 = await createUser(request, requestData.newUser);
        return createdUser1;
      });
      //Act
      const createdUser2 = await test.step("Create a second user with the same email", async () => {
        const createdUser2 = await createUser(request, requestData.newUser, false); // 'false' to turn failOnStatusCode off.
        return createdUser2;
      });
      //Assert
      await test.step("Attempt to create a user with the same email should return:", async () => {
        expect.soft(createdUser2.response.status()).toBe(422);
        expect.soft(createdUser2.response.statusText()).toBe("422 Unprocessable Entity");
      });
    });
  });
});
