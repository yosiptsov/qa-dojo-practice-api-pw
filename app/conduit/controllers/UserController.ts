import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseController } from "./BaseController";

// types
import {
  CreateUserPayload,
  CreateUserResponse,
  UserProfileResponse,
  UnauthorizedResponse,
  UserUpdateResponse,
} from "../json-schemas/Users";

export class UserController extends BaseController {
  endpoint = "/api/user";

  // POST: Create a new user
  async createUser(
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
  async updateUser(
    request: APIRequestContext,
    fieldsToUpdate: Partial<UserProfileResponse>,
    failOnStatusCode: boolean = true,
  ): Promise<{ response: APIResponse; json: UserUpdateResponse | UnauthorizedResponse }> {
    const response = await request.put("/api/user", {
      data: { user: fieldsToUpdate },
      failOnStatusCode: failOnStatusCode,
    });
    const json = await response.json();
    return { response, json };
  }
}
