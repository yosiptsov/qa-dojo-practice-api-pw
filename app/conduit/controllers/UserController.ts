import { APIRequestContext } from "@playwright/test";
import { BaseController } from "./BaseController";

// types
import { CreateUserPayload, UserProfileResponse } from "../json-schemas/Users";

export class UserController extends BaseController {
  private endpointCreate = "/api/users";
  private endpoint = "/api/user";

  // POST: Create a new user
  async createUser(newUser: CreateUserPayload, failOnStatusCode: boolean = true) {
    const response = await this.request.post(this.endpointCreate, {
      data: newUser,
      failOnStatusCode: failOnStatusCode,
    });

    const json = await response.json();
    return { response, json };
  }
  // GET: current user
  async getCurrentUser(failOnStatusCode: boolean = true) {
    const response = await this.request.get(this.endpoint, {
      failOnStatusCode: failOnStatusCode,
    });

    const json = await response.json();
    return { response, json };
  }

  // PUT: Update a user profile
  async updateUser(fieldsToUpdate: Partial<UserProfileResponse>, failOnStatusCode: boolean = true) {
    const response = await this.request.put(this.endpoint, {
      data: { user: fieldsToUpdate },
      failOnStatusCode: failOnStatusCode,
    });
    const json = await response.json();
    return { response, json };
  }
}
