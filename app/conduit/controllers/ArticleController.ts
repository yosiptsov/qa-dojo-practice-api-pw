import { APIRequestContext } from "@playwright/test";
import { BaseController } from "./BaseController";
// types
import { CreateUserPayload, UserProfileResponse } from "../json-schemas/Users";

export class ArticleController extends BaseController {
  private endpoint = "/api/articles";

  // POST: Create a new article
  async createArticle(newUser: CreateUserPayload, failOnStatusCode: boolean = true) {
    const response = await this.request.post(this.endpoint, {
      data: newUser,
      failOnStatusCode: failOnStatusCode,
    });

    const json = await response.json();
    return { response, json };
  }
  // GET: an article
  async getArticle(failOnStatusCode: boolean = true) {
    const response = await this.request.get(this.endpoint, {
      failOnStatusCode: failOnStatusCode,
    });

    const json = await response.json();
    return { response, json };
  }

  // PUT: Update an article
  async updateArticle(fieldsToUpdate: Partial<UserProfileResponse>, failOnStatusCode: boolean = true) {
    const response = await this.request.put(this.endpoint, {
      data: { user: fieldsToUpdate },
      failOnStatusCode: failOnStatusCode,
    });
    const json = await response.json();
    return { response, json };
  }
}
