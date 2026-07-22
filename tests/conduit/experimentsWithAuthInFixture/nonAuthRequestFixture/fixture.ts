import { APIRequestContext, test as base, request as APIRequest } from "@playwright/test";

// it takes env variables from .env through ZOD validation envValidation.ts
import { envConduit } from "../../../../envValidation";

// set a type for fixture
type Fixtures = {
  nonAuthRequest: APIRequestContext;
  userEmail: string;
  userPass: string;
};

export const test = base.extend<Fixtures>({
  // set default values for fixture
  userEmail: envConduit.CONDUIT_DEFAULT_EMAIL,
  userPass: envConduit.CONDUIT_DEFAULT_PASS,

  // This is returns not authorized fixture 'request'. This is an alternative option not to use isAuthorized option.
  // You just can use this fixture test('Test description', async ({ nonAuthRequest })
  // instead of test('Test description', async ({ request })
  nonAuthRequest: async ({}, use) => {
    const req = await APIRequest.newContext();
    await use(req);

    // ? AI recommended doing this. There is no such code in the lecture
    await req.dispose();
  },

  request: async ({ request, userEmail, userPass }, use) => {
    // else, if isAuthorized = False, do authorization and return changed fixture 'request' with auth
    const token = await getToken(request, userEmail, userPass);

    // create a new request context
    const req = await APIRequest.newContext({
      extraHTTPHeaders: {
        Authorization: `Token ${token}`,
      },
    });

    // return new request context
    await use(req);
    // put steps that you want to be done after the test

    // ? AI recommended doing this. There is no such code in the lecture
    await req.dispose();
  },
});

async function getToken(request: APIRequestContext, email: string, password?: string) {
  const response = await request.post("/api/users/login", {
    data: {
      user: {
        email: email || envConduit.CONDUIT_DEFAULT_EMAIL,
        password: password || envConduit.CONDUIT_DEFAULT_PASS,
      },
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const token = json["user"]["token"];

  return token;
}
