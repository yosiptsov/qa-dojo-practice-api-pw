import { expect } from "@playwright/test";
// fixture prepares test data: newUser, Updated user
import { test } from "./fixtures";
// types
import { UserPayload } from "../../../app/fakeapi-platzi/types/users";
import { UserResponse } from "../../../app/fakeapi-platzi/json-schemas/Users";
// schema
import { UserResponseSchema } from "../../../app/fakeapi-platzi/json-schemas/Users";
// helpers CRUD
import { createUser } from "../../../app/fakeapi-platzi/utils/users/users-crud";
// tags from enum
import { TAG } from "../../../app/fakeapi-platzi/tags/tags";

test.describe(
  "Verification of CRUD and schema for endpoint /api/v1/users: ",
  { tag: [TAG.crud, TAG.users, TAG.schemaValidation, TAG.positive] },
  () => {
    // let userId: number;
    // let userResponse: UserResponse;

    // test.beforeEach(async ({ requestData, request }) => {
    //   const jsonCreated = await createUser(request, requestData.newUser);
    //   userId = jsonCreated.id;
    //   userResponse = jsonCreated;
    // });

    test("POST - Create a user, response should have proper values and schema - |test id: L13-3:t1|", async ({
      request,
      requestData,
    }) => {
      //Arrange
      //Act
      const createdUser = await test.step("Create a new user", async () => {
        const createdUser = await createUser(request, requestData.newUser);
        return createdUser;
      });
      //Assert

      await test.step("Check response status is 201 / OK", () => {
        expect(createdUser.response.status()).toBe(201);
        expect(createdUser.response.statusText()).toBe("Created");
      });

      await test.step("Check JSON schema match ZOD template", () => {
        const data = UserResponseSchema.safeParse(createdUser.json);
        expect(data.success, { message: data.error?.message }).toBeTruthy();
      });

      await test.step("Check response headers match requirements", () => {
        const headers = createdUser.response.headers();
        expect.soft(headers["content-type"]).toContain("application/json");
        expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
        expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
        expect.soft(headers["content-security-policy"]).toContain("base-uri");
      });

      await test.step("Check response values match input values", () => {
        expect(createdUser.json).toMatchObject({
          name: requestData.newUser.name,
          password: requestData.newUser.password,
          email: requestData.newUser.email,
          avatar: requestData.newUser.avatar,
        });
      });
    });
  },
);
