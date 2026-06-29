import { expect, APIRequestContext } from "@playwright/test";
import { ProductData, ProductResponse } from "../types/products";

// create a new product POST
export async function createProduct(request: APIRequestContext, newProduct: ProductData): Promise<ProductResponse> {
  const response = await request.post("/api/v1/products/", {
    data: newProduct,
    failOnStatusCode: true,
  });

  const json = await response.json();
  return json;
}

// read product / products GET
export async function readProduct(request: APIRequestContext, productId?: Number) {
  // product id can be empty, so let's prepare url
  const url = productId ? `/api/v1/products/${productId}` : "/api/v1/products/";
  const response = await request.get(url, { failOnStatusCode: true });

  return response;
}

// update a product (PUT)
export async function updateProduct(request: APIRequestContext, updProduct: ProductData, productId: Number) {
  const response = await request.put(`/api/v1/products/${productId}`, {
    data: updProduct,
    failOnStatusCode: true,
  });

  return response;
}

// delete a product (DELETE)
export async function deleteProduct(request: APIRequestContext, productId: Number) {
  const response = await request.delete(`/api/v1/products/${productId}`, { failOnStatusCode: true });

  return response;
}

// delete all products from an array (DELETE)
export async function deleteAllProducts(request: APIRequestContext, productIds: string[]): Promise<void> {
  for (const productId of productIds) {
    const response = await request.delete(`/api/v1/products/${productId}`, { failOnStatusCode: true });
    expect(response.status()).toBe(200);
  }
}
