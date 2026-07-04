import { expect } from "@playwright/test";
// fixture prepares test data: newUser, Updated user
import { test } from "./fixtures";
// types
import { UserPayload } from "../../../app/fakeapi-platzi/types/users";
import { UserResponse } from "../../../app/fakeapi-platzi/json-schemas/Users";
// schema
import { UserResponseSchema, UserListResponseSchema } from "../../../app/fakeapi-platzi/json-schemas/Users";
// helpers CRUD
import { createUser, readUsers } from "../../../app/fakeapi-platzi/utils/users/users-crud";
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

    test("GET - list of all users should: |test id: L13-3:t2|", async ({ request, requestData }) => {
      //Arrange
      const createdUser = await test.step("Create a new user", async () => {
        const createdUser = await createUser(request, requestData.newUser);
        return createdUser;
      });
      //Act
      const allUsersList = await test.step("get list of all users", async () => {
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
        const headers = createdUser.response.headers();
        expect.soft(headers["content-type"]).toContain("application/json");
        expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
        expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
        expect.soft(headers["content-security-policy"]).toContain("base-uri");
      });

      await test.step("contains just added user", async () => {
        const foundUser = allUsersList.json.find((elem) => elem.id === createdUser.json.id);
        expect(foundUser).toBeDefined();
        console.log(foundUser);
      });

      await test.step("all users have role defined, one of customer | admin", async () => {});
    });
  });
});
