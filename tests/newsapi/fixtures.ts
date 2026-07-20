import { test as base, request as APIRequest } from "@playwright/test";

import { envNewsapi } from "../../envValidation";

type Fixtures = {};

export const test = base.extend<Fixtures>({
  //add auto login using token for each request
  request: async ({}, use) => {
    const token = envNewsapi.NEWSAPI_API_KEY;
    const req = await APIRequest.newContext({
      failOnStatusCode: true,
      extraHTTPHeaders: {
        "x-api-key": `${token}`,
      },
    });
    await use(req);
  },
});
