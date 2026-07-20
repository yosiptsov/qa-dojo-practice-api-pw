import { APIRequestContext, APIResponse } from "@playwright/test";

// types
import { CreateUserPayload, CreateUserResponse } from "../json-schemas/Users";

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
