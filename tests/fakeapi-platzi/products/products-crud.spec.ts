import { expect } from "@playwright/test";
import { test } from "./fixtures";
import {
  createProduct,
  readProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} from "../../../app/fakeapi-platzi/utils/products/products-crud";
import * as ProductsSearch from "../../../app/fakeapi-platzi/utils/products/products-search";
import { ProductResponse } from "../../../app/fakeapi-platzi/types/products";
import { TAG } from "../../../app/fakeapi-platzi/tags/tags";

test.describe("created product should: ", { tag: [TAG.product, TAG.crud, TAG.positive] }, () => {
  let productId: number;

  test.beforeAll(async ({ request }) => {
    // check if test products from previous runs exist and delete them
    const findOldTestProducts = await ProductsSearch.findProductsBySubString(request, "Hogwarts castle LEGO");
    if (findOldTestProducts.length > 0) {
      await deleteAllProducts(request, findOldTestProducts);
      console.log("The following old test data products have been deleted: ", findOldTestProducts);
    }
  });

  test.beforeEach(async ({ request, requestData }) => {
    const jsonCreated = await createProduct(request, requestData.newProduct);
    productId = jsonCreated.id;
  });

  test.afterEach(async ({ request }) => {
    // Data teardown
    const delResponse = await deleteProduct(request, productId);
    expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
  });

  test("be present and have proper fields && values - |test id: L12:t1|", async ({ request, requestData }) => {
    const { getProdResponse, getProdResponseJson } = await test.step("Read created product with get", async () => {
      const getProdResponse = await readProduct(request, productId);
      const getProdResponseJson = await getProdResponse.json();
      return { getProdResponse, getProdResponseJson };
    });

    await test.step("Verify response status is 200 / OK", async () => {
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
        title: requestData.newProduct.title,
        price: requestData.newProduct.price,
        description: requestData.newProduct.description,
        images: requestData.newProduct.images,
      });
    });
  });

  test("be present in the products list - |test id: L12:t2|", async ({ request, requestData }) => {
    const { getProdResponse, getProdResponseJson } = await test.step("Read created product with get", async () => {
      const getProdResponse = await readProduct(request);
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
        title: requestData.newProduct.title,
        price: requestData.newProduct.price,
        description: requestData.newProduct.description,
        images: requestData.newProduct.images,
      });
    });
  });

  test("be present in the list with updated data - |test id: L12:t3|", async ({ request, requestData }) => {
    await updateProduct(request, requestData.updatedProduct, productId);

    const getProdResponse = await readProduct(request, productId);
    const getProdResponseJson = await getProdResponse.json();
    expect(getProdResponse.status()).toBe(200);
    expect(getProdResponse.statusText()).toBe("OK");
    expect(getProdResponseJson).toMatchObject({
      id: productId,
      title: requestData.updatedProduct.title,
      price: requestData.updatedProduct.price,
      description: requestData.updatedProduct.description,
      images: requestData.updatedProduct.images,
    });
  });
});
