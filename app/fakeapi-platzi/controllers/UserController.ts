import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseController } from "./BaseController";

// types
import { UserPayload } from "../types/users";
import { UserResponse, UserNotFoundResponse } from "../json-schemas/Users";

export class UserController extends BaseController {
  private endpoint = "/api/v1/users/";

  // POST: Create a new user
  async createUser(
    request: APIRequestContext,
    newUser: UserPayload,
    failOnStatusCode: boolean = true,
  ): Promise<{ response: APIResponse; json: UserResponse }> {
    const response = await request.post(this.endpoint, {
      data: newUser,
      failOnStatusCode: failOnStatusCode,
    });

    const json = await response.json();
    return { response, json };
  }

  // GET: Read a user by ID or all Users
  async readUsers(
    request: APIRequestContext,
    userId?: number,
    failOnStatusCode: boolean = true,
  ): Promise<{ response: APIResponse; json: UserResponse[] | UserResponse | UserNotFoundResponse }> {
    const url = userId ? `${this.endpoint}${userId}` : this.endpoint; // user id can be empty, so let's prepare url
    const response = await request.get(url, { failOnStatusCode: failOnStatusCode }); // true by default

    const json = await response.json();
    return { response, json };
  }

  // PUT: Update a user by ID
  async updateUser(
    request: APIRequestContext,
    userId: number,
    fieldsToUpdate: {},
    failOnStatusCode: boolean = true,
  ): Promise<{ response: APIResponse; json: UserResponse[] | UserResponse | UserNotFoundResponse }> {
    const response = await request.put(`${this.endpoint}${userId}`, {
      data: fieldsToUpdate,
      failOnStatusCode: failOnStatusCode,
    });
    const json = await response.json();
    return { response, json };
  }
}
