import { expect } from "@playwright/test";
// fixture prepares test data: newUser, Updated user
import { test } from "./fixtures";
// types
import { UserPayload } from "../../../app/fakeapi-platzi/types/users";
import { UserResponse } from "../../../app/fakeapi-platzi/json-schemas/Users";
// helpers CRUD
import { createUser } from "../../../app/fakeapi-platzi/utils/users/users-crud";
// tags from enum
import { TAG } from "../../../app/fakeapi-platzi/tags/tags";

test.describe("Verification of CRUD and schema for endpoint /Users: ", { tag: TAG.schemaValidation }, () => {
  let userId: number;
  let userResponse: UserResponse;

  test.beforeEach(async ({ requestData, request }) => {
    const jsonCreated = await createUser(request, requestData.newUser);
    userId = jsonCreated.id;
    userResponse = jsonCreated;
  });

  test("Users list: /api/v1/users", async () => {});
});
