import { APIRequestContext, test as base, request as APIRequest } from "@playwright/test";

type Fixtures = {};

export const test = base.extend<Fixtures>({
  request: async ({ request }, use) => {
    // отримаємо токен
    const token = await getToken(request);

    // створюємо новий контекст реквесту
    const req = await APIRequest.newContext({
      extraHTTPHeaders: {
        Authorization: `Token ${token}`,
      },
    });

    // повертаємо новий контекст
    await use(req);
  },
});

async function getToken(request: APIRequestContext) {
  const response = await request.post("/api/users/login", {
    data: {
      user: {
        email: process.env.CONDUIT_DEFAULT_EMAIL,
        password: process.env.CONDUIT_PASSWORD,
      },
    },
    failOnStatusCode: true,
  });

  const json = await response.json();
  const token = json["user"]["token"];

  return token;
}
