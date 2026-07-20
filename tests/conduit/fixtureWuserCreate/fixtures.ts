import { APIRequestContext, test as base, request as APIRequest } from "@playwright/test";
// helpers
import { createUser } from "../../../app/conduit/utils/userCrud";
// types
import { CreateUserPayload } from "../../../app/conduit/json-schemas/Users";
//it takes env variables from .env through ZOD validation envValidation.ts
import { envConduit } from "../../../envValidation";
// use faker for random test data generation
import { faker } from "@faker-js/faker";

// 1. Describe types for options and our new fixture
type Fixtures = {
  //options
  isAuthorized: boolean; // true — authentication required, false — clean request
  isNeedToCreateUser: boolean; // true — create a new unique user, false — use an existing one
  // test data
  existingUserEmail: string; // email for the existing user
  existingUserPass: string; // password for the existing user
  newUserPayload: CreateUserPayload | null; // allows passing a custom payload from the test

  authRequest: APIRequestContext; // Our new authorized fixture. It has name authRequest not just request, to not to change fixture 'request'
};

export const test = base.extend<Fixtures>({
  // 2. Set default values for fixture parameters
  isAuthorized: true,
  isNeedToCreateUser: false,
  existingUserEmail: envConduit.CONDUIT_DEFAULT_EMAIL,
  existingUserPass: envConduit.CONDUIT_DEFAULT_PASS,
  newUserPayload: null,

  // 3. Implement the authRequest fixture
  authRequest: async (
    { request, isAuthorized, isNeedToCreateUser, newUserPayload, existingUserEmail, existingUserPass },
    use,
  ) => {
    // CASE 1: Authentication is not required at all
    if (!isAuthorized) {
      await use(request); // Return the base unauthorized client
      return;
    }

    let targetEmail = existingUserEmail;
    let targetPass = existingUserPass;
    let contextToDispose: APIRequestContext | null = null;

    try {
      // CASE 2: Need to create a NEW unique user
      if (isNeedToCreateUser) {
        const testUserNumber = faker.string.uuid();

        // If the test did not pass a custom payload, generate a random one
        const generatedPayload: CreateUserPayload = newUserPayload || {
          user: {
            email: `youser${testUserNumber}@gm1.com`,
            password: envConduit.CONDUIT_DEFAULT_PASS,
            username: `youser${testUserNumber}`,
          },
        };

        // Create the user in the system using the base API client
        await createUser(request, generatedPayload);

        // Save user credentials for the subsequent login step
        targetEmail = generatedPayload.user.email;
        targetPass = generatedPayload.user.password;
      }

      // CASE 3 (Default): Login either the new or existing user from env
      const token = await getToken(request, targetEmail, targetPass);

      // Create an isolated context with the Authorization header
      const authContext = await APIRequest.newContext({
        extraHTTPHeaders: {
          Authorization: `Token ${token}`,
        },
      });

      contextToDispose = authContext;

      // Pass the authorized context into the test
      await use(authContext);
    } finally {
      // Always dispose of the context after the test finishes to avoid memory leaks
      if (contextToDispose) {
        await contextToDispose.dispose();
      }
    }
  },
});

async function getToken(request: APIRequestContext, email: string, password?: string) {
  const response = await request.post("/api/users/login", {
    data: {
      user: {
        email: email,
        password: password || envConduit.CONDUIT_DEFAULT_PASS,
      },
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  return json["user"]["token"];
}

// after review AI added.
// 1. contextToDispose.dispose()
// 2. Try and finally to be able to dispose context.
// 3. Some additional comments
