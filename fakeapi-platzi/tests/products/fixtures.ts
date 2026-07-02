import { test as base, expect } from "@playwright/test";
import { ProductData } from "../../app/types/products";
import { faker } from "@faker-js/faker";

type MyFixtures = {
  requestData: {
    newProduct: ProductData;
    updatedProduct: ProductData;
  };
};

export const test = base.extend<MyFixtures>({
  requestData: async ({}, use) => {
    // prepare a random test data
    const productNumber = faker.number.float({ min: 1, max: 100, fractionDigits: 5 });
    const productMaterial = faker.commerce.productMaterial();
    const productNumDetails = faker.number.int({ min: 450, max: 10_000 });

    const newProduct: ProductData = {
      title: `Hogwarts castle LEGO #${productNumber}`,
      price: 10,
      description: `Hogwarts castle LEGO #${productNumber}. This set has ${productNumDetails} parts. It is made from safe material: ${productMaterial}`,
      categoryId: 1,
      images: ["https://placehold.co/600x400"],
    };

    const updatedProduct: ProductData = {
      title: `<UPDATED> Hogwarts castle LEGO #${productNumber}`,
      price: 20,
      description: `<UPDATED> A description for Hogwarts castle LEGO #${productNumber}`,
      categoryId: 2,
      images: ["https://updated.placehold.co/600x400", "https://updated.placehold.co/800x600"],
    };

    await use({ newProduct, updatedProduct });
  },
});
