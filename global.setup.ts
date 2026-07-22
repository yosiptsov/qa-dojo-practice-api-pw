import { FullConfig, request as APIRequest } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("Global Setup started");

  const request = await APIRequest.newContext();

  // check that fakeapi-platzi works
  await request.get(config.projects[0].use.baseURL + "/api/v1/products/", {
    params: {
      offset: 0,
      limit: 1,
    },
    failOnStatusCode: true,
  });

  // check that conduit works
  await request.get(config.projects[1].use.baseURL + "/api/articles", {
    params: {
      offset: 0,
      limit: 1,
    },
    failOnStatusCode: true,
  });

  // check that newsapi works
  await request.get(config.projects[2].use.baseURL + "/", {
    params: {
      offset: 0,
      limit: 1,
    },
    failOnStatusCode: true,
  });

  console.log("Global Setup finished");
}

export default globalSetup;
