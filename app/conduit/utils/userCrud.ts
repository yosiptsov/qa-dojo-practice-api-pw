import { APIRequestContext, APIResponse } from "@playwright/test";

// types
import { CreateUserPayload, CreateUserResponse, UserProfileResponse } from "../json-schemas/Users";

// POST: Create a new user
export async function createUser(
  request: APIRequestContext,
  newUser: CreateUserPayload,
  failOnStatusCode: boolean = true,
): Promise<{ response: APIResponse; json: CreateUserResponse }> {
  const response = await request.post("/api/users", {
    data: newUser,
    failOnStatusCode: failOnStatusCode,
  });

  const json = await response.json();
  return { response, json };
}

// PUT: Update a user profile
export async function updateUser(
  request: APIRequestContext,
  fieldsToUpdate: {},
  failOnStatusCode: boolean = true,
): Promise<{ response: APIResponse; json: UserProfileResponse }> {
  const response = await request.put("/api/user", {
    data: fieldsToUpdate,
    failOnStatusCode: failOnStatusCode,
  });
  const json = await response.json();
  return { response, json };
}
