import { APIRequestContext, APIResponse } from "@playwright/test";

// types
import { UserPayload } from "../../types/users";
import { UserResponse } from "../../json-schemas/Users";

// POST: Create a new user
export async function createUser(
  request: APIRequestContext,
  newUser: UserPayload,
): Promise<{ response: APIResponse; json: UserResponse }> {
  const response = await request.post("/api/v1/users/", {
    data: newUser,
    failOnStatusCode: true,
  });

  const json = await response.json();
  return { response, json };
}

// GET: Read a user by ID or all Users
export async function readUsers(
  request: APIRequestContext,
  userId?: Number,
): Promise<{ response: APIResponse; json: UserResponse[] }> {
  // user id can be empty, so let's prepare url
  const url = userId ? `/api/v1/users/${userId}` : "/api/v1/users/";
  const response = await request.get(url, { failOnStatusCode: true });

  const json = await response.json();
  return { response, json };
}
