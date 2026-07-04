import { test as base, expect } from "@playwright/test";
import { UserPayload } from "../../../app/fakeapi-platzi/types/users";
import { faker } from "@faker-js/faker";

type MyFixtures = {
  requestData: {
    newUser: UserPayload;
    updatedUser: UserPayload;
  };
};

export const test = base.extend<MyFixtures>({
  requestData: async ({}, use) => {
    // prepare a random test data
    const testUserNumber = faker.string.uuid();

    const newUser: UserPayload = {
      name: `YOuser${testUserNumber}`,
      email: `YOuser${testUserNumber}@gm1.com`,
      password: "1234",
      avatar: "https://picsum.photos/800",
    };

    const updatedUser: UserPayload = {
      name: `YOuserUpd${testUserNumber}`,
      email: `YOuserUpd${testUserNumber}@gm1.com`,
      password: "1234",
      avatar: "https://picsum.photos/800",
    };

    await use({ newUser, updatedUser });
  },
});
