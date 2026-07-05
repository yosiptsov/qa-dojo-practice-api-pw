import { APIRequestContext, test as base, request as APIRequest } from "@playwright/test";

type Fixtures = {};

export const test = base.extend<Fixtures>({
  // login
  request: async ({}, use) => {
    const apiKey = process.env.NEWSAPI_API_KEY;

    const req = await APIRequest.newContext({
      failOnStatusCode: true,
      params: {
        apiKey: `${apiKey}`,
      },
    });

    await use(req);
  },
});
