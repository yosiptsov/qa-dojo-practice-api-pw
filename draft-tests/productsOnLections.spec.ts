import { test, expect } from "@playwright/test";

const randomNumber = Math.floor(Math.random() * 10000);

const newProduct = {
  title: `New Product ${randomNumber}`,
  slug: "new-product-${randomNumber}",
  price: 10,
  description: `A description for New Product ${randomNumber}`,
  categoryId: 1,
  images: ["https://placehold.co/600x400"],
};

test("get products should be successful", async ({ request }) => {
  const response = await request.get("/products");
});

test("create product - should be successful", async ({ request }) => {
  const response = await request.post("/products", {
    data: newProduct,
    failOnStatusCode: true,
  });

  expect(response.ok()).toBeTruthy();
});

test("update product - should be successful", async ({ request }) => {
  const newData = {
    title: "Changed title",
    price: 100,
  };

  const response = await request.post("/products", {
    data: newProduct,
    failOnStatusCode: true,
  });
  const json = await response.json();
  const productId = json.id;

  await request.put(`/products/${productId}`, {
    data: newData,
    failOnStatusCode: true,
  });
});

test("delete product - should be successful", async ({ request }) => {
  const response = await request.post("/products", {
    data: newProduct,
    failOnStatusCode: true,
  });
  const json = await response.json();
  const productId = json.id;

  const delResponse = await request.delete(`/products/${productId}`, {
    failOnStatusCode: true,
  });

  expect(response.status()).toBe(201);
  expect(response.statusText()).toBe("Created");
  expect(delResponse.ok()).toBe(true);
  expect(delResponse.statusText()).toBe("Ok");
});

test("created product should have correct data", async ({ request }) => {
  expect(json).toHaveProperty("title", "Product name");
  expect(json).toHaveProperty("price", 100);
  expect(json).toHaveProperty("description", "Product description");

  expect(json).toHaveProperty("images", ["https://placehold.co/600x400"]);
  expect(json).toHaveProperty("category.id", 1);
});
