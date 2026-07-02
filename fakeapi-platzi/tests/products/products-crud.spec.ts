import { test, expect } from "@playwright/test";
import * as ProductsCrud from "../../app/utils/products-crud";
import * as ProductsSearch from "../../app/utils/products-search";
import { ProductData, ProductResponse } from "../../app/types/products";
import { TAG } from "../../app/tags/tags";
import { faker } from "@faker-js/faker";

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

test.describe("created product should: ", { tag: [TAG.product, TAG.create, TAG.positive] }, () => {
  let productId: number;

  test.beforeAll(async ({ request }) => {
    // check if test products from previous runs exist and delete them
    const findOldTestProducts = await ProductsSearch.findProductsBySubString(request, "Hogwarts castle LEGO");
    if (findOldTestProducts.length > 0) {
      await ProductsCrud.deleteAllProducts(request, findOldTestProducts);
      console.log("The following old test data products have been deleted: ", findOldTestProducts);
    }
  });

  test.beforeEach(async ({ request }) => {
    const jsonCreated = await ProductsCrud.createProduct(request, newProduct);
    productId = jsonCreated.id;
  });

  test.afterEach(async ({ request }) => {
    // Data teardown
    const delResponse = await ProductsCrud.deleteProduct(request, productId);
    expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
  });

  test("be present and have proper fields && values - |test id: L12:t1|", async ({ request }) => {
    const { getProdResponse, getProdResponseJson } = await test.step("Read created product with get", async () => {
      const getProdResponse = await ProductsCrud.readProduct(request, productId);
      const getProdResponseJson = await getProdResponse.json();
      return { getProdResponse, getProdResponseJson };
    });

    await test.step("Verify response status", async () => {
      expect(getProdResponse.status()).toBe(200);
      expect(getProdResponse.statusText()).toBe("OK");
    });

    await test.step("Verify response headers", () => {
      const headers = getProdResponse.headers();
      expect.soft(headers["content-type"]).toContain("application/json");
      expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
      expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
      expect.soft(headers["content-security-policy"]).toContain("base-uri");
    });

    await test.step("Verify response values match input product values", () => {
      expect(getProdResponseJson).toMatchObject({
        id: productId,
        title: newProduct.title,
        price: newProduct.price,
        description: newProduct.description,
        images: newProduct.images,
      });
    });
  });

  test("be present in the products list - |test id: L12:t2|", async ({ request }) => {
    const { getProdResponse, getProdResponseJson } = await test.step("Read created product with get", async () => {
      const getProdResponse = await ProductsCrud.readProduct(request);
      const getProdResponseJson = await getProdResponse.json();
      return { getProdResponse, getProdResponseJson };
    });

    const foundProd = await test.step("find product in the list", () => {
      return getProdResponseJson.find((prod: ProductResponse) => prod.id === productId);
    });

    await test.step("Verify response headers", () => {
      const headers = getProdResponse.headers();
      expect.soft(headers["content-type"]).toContain("application/json");
      expect.soft(headers["cross-origin-opener-policy"]).toBe("same-origin");
      expect.soft(headers["cross-origin-resource-policy"]).toBe("same-origin");
      expect.soft(headers["content-security-policy"]).toContain("base-uri");
    });

    await test.step("Verify created product matches the product in the list", async () => {
      expect(foundProd, `Product ${productId} was not found in the response`).toBeDefined();
      expect(foundProd).toMatchObject({
        id: productId,
        title: newProduct.title,
        price: newProduct.price,
        description: newProduct.description,
        images: newProduct.images,
      });
    });
  });

  test("be present in the list with updated data - |test id: L12:t3|", async ({ request }) => {
    const updatedProduct: ProductData = {
      title: `<UPDATED> Hogwarts castle LEGO #${productNumber}`,
      price: 20,
      description: `<UPDATED> A description for Hogwarts castle LEGO #${productNumber}`,
      categoryId: 2,
      images: ["https://updated.placehold.co/600x400"],
    };

    await ProductsCrud.updateProduct(request, updatedProduct, productId);

    const getProdResponse = await ProductsCrud.readProduct(request, productId);
    const getProdResponseJson = await getProdResponse.json();
    expect(getProdResponse.status()).toBe(200);
    expect(getProdResponse.statusText()).toBe("OK");
    expect(getProdResponseJson).toMatchObject({
      id: productId,
      title: updatedProduct.title,
      price: updatedProduct.price,
      description: updatedProduct.description,
      images: updatedProduct.images,
    });
  });
});
