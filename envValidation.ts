import { z } from "zod";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

const envSchemaFakeApi = z.object({
  //fakeapi vars
  FAKEAPI_BASE_URL: z.url(),
  FAKEAPI_USER_PASS: z.string(),
});

const envSchemaConduit = z.object({
  //conduit vars
  CONDUIT_BASE_URL: z.url(),
  CONDUIT_DEFAULT_EMAIL: z.email("Email is required for tests!"),
  CONDUIT_DEFAULT_PASS: z.string("Password is required for tests!"),
  CONDUIT_ADMIN_EMAIL: z.email("Email is required for tests!"),
  CONDUIT_ADMIN_PASS: z.string("Password is required for tests!"),
  CONDUIT_USER_EMAIL: z.email("Email is required for tests!"),
  CONDUIT_USER_PASS: z.string("Password is required for tests!"),
});

const envSchemaNewsapi = z.object({
  //newsapi vars
  NEWSAPI_BASE_URL: z.url(),
  NEWSAPI_API_KEY: z.string(),
});

export const envFakeApi = envSchemaFakeApi.parse(process.env);
export const envConduit = envSchemaConduit.parse(process.env);
export const envNewsapi = envSchemaNewsapi.parse(process.env);
