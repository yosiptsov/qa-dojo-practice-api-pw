import { APIRequestContext, APIResponse } from "@playwright/test";

// types
import { NewsApiResponse } from "../json-schemas/News";

// GET search news by params /v2/everything
export async function searchNewsByParams(
  request: APIRequestContext,
  query: string,
  fromDate: string = "",
  toDate: string = "",
  page: number = 1,
  pageSize: number = 1,
  failOnStatusCode: boolean = true,
): Promise<{ response: APIResponse; json: NewsApiResponse }> {
  const response = await request.get("/v2/everything", {
    params: {
      q: query,
      from: fromDate,
      to: toDate,
      page: page,
      pageSize: pageSize,
    },
    failOnStatusCode: failOnStatusCode,
  });

  const json = await response.json();
  return { response, json };
}
