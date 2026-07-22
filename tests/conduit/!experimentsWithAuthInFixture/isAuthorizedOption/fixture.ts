import { APIRequestContext, test as base, request as APIRequest } from "@playwright/test";

// it takes env variables from .env through ZOD validation envValidation.ts
import { envConduit } from "../../../../envValidation";

type Fixtures = {
  isAuthorized: boolean;
  userEmail: string;
  userPass: string;
};

export const test = base.extend<Fixtures>({
  // set default values for fixture
  isAuthorized: true,
  userEmail: envConduit.CONDUIT_DEFAULT_EMAIL,
  userPass: envConduit.CONDUIT_DEFAULT_PASS,

  request: async ({ request, isAuthorized, userEmail, userPass }, use) => {
    // check if isAuthorized is False, then return not changed fixture 'request'
    if (!isAuthorized) {
      await use(request);
      return; // add 'return', to stop the code execution
    }

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
