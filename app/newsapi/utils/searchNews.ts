import { APIRequestContext, APIResponse } from "@playwright/test";

// GET search news by params /v2/everything
export async function searchNewsBy(
  request: APIRequestContext,
  query: string,
  fromDate: string = "",
  toDate: string = "",
  failOnStatusCode: boolean = true,
): Promise<{ response: APIResponse; json: UserResponse }> {
  const response = await request.get("/v2/everything", {
    params: {
      q: query,
      from: fromDate,
      to: toDate,
    },
    failOnStatusCode: failOnStatusCode,
  });

  const json = await response.json();
  return { response, json };
}
