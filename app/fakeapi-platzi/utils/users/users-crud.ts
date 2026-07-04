import { APIRequestContext } from "@playwright/test";

// types
import { UserPayload } from "../../types/users";
import { UserResponse } from "../../json-schemas/Users";

// Create a new user POST
export async function createUser(request: APIRequestContext, newUser: UserPayload): Promise<UserResponse> {
  const response = await request.post("/api/v1/users/", {
    data: newUser,
    failOnStatusCode: true,
  });

  const json = await response.json();
  return json;
}
