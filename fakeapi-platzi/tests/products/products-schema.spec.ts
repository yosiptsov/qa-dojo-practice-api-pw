import { test } from "./fixtures";
import { expect } from "@playwright/test";
import { createProduct, readProduct, deleteProduct } from "../../app/utils/products-crud";
import { TAG } from "../../app/tags/tags";
import { ProductResponse } from "../../app/types/products";
import { z } from "zod";
import { Products } from "../../app/json-schemas/Products";

// ? 1. Великі маленькі букви в назвах файлів.

// ? 2. При створенні схеми через ZOD, ШІ мені запропонувало тут же створити type для респонсу.
// ? Де краще це робити, як окремий файл types/products, чи в файлах схеми? Якщо в схемі, то що робити з типами для Payload?

// ? 3.

test.describe("Schema validation of /Products: ", { tag: TAG.schemaValidation }, () => {
  let productId: number;
  let productPostResponse: ProductResponse;

  test.beforeEach(async ({ requestData, request }) => {
    const jsonCreated = await createProduct(request, requestData.newProduct);
    productId = jsonCreated.id;
    productPostResponse = jsonCreated;
  });

  test.afterEach(async ({ request }) => {
    const delResponse = await deleteProduct(request, productId);
    expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
  });

  test("POST response, Create Product - |test id: L14:t1|", async ({ requestData, request }) => {
    const data = Products.safeParse(productPostResponse);
    expect(data.success, { message: data.error?.message }).toBeTruthy();
  });

  test("GET response, Read Product - |test id: L14:t2|", async ({ requestData, request }) => {
    const readResponse = await readProduct(request, productId);
    const readResponseJson = await readResponse.json();

    const data = Products.safeParse(readResponseJson);
    expect(data.success, { message: data.error?.message }).toBeTruthy();
  });
});
