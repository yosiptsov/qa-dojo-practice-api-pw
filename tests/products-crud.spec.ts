import { test, expect, APIRequestContext } from "@playwright/test";

//* TEST DATA AND HELPER FUNCTIONS
// TODO: move helper functions to a Page object class.

/* - Questions
? #1 не прийняло повний base URL: https://api.escuelajs.co/api/v1
? #2 як працює цей код?   const json = await response.json();
? console.log(`Product is successfully created with ID: ${json.id}`); - чому console.log працює пізніше вейта?
? #3 : Promise<Object> як тип функції. Як вірно вказати тип, якщо вона повертає json?
? #4 якщо попередні степи тесту впали, то не відбувається видалення доданого продукту. Як зробити щоб відбувалося?
? #5 останній тест assert "бачить" не проапдейчений продукт, хоча через постмен бачу що він проапдейтився.
*/

// set a new type for payload Product
type ProductData = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

// set a new type for response Product and included obj category
type Category = {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};

type ProductResponse = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
};

// prepare a random test data
const randomNumber = Math.floor(Math.random() * 10000);

const newProduct: ProductData = {
  title: `Hogwarts castle LEGO #${randomNumber}`,
  price: 10,
  description: `A description for Hogwarts castle LEGO #${randomNumber}`,
  categoryId: 1,
  images: ["https://placehold.co/600x400"],
};

// create a new product POST
async function createProduct(request: APIRequestContext, newProduct: ProductData): Promise<ProductResponse> {
  const response = await request.post("/api/v1/products/", {
    data: newProduct,
    failOnStatusCode: true,
  });

  const json = await response.json();
  return json;
}

// read product / products GET
async function readProduct(request: APIRequestContext, productId?: Number) {
  // product id can be empty, so let's prepare url
  const url = productId ? `/api/v1/products/${productId}` : "/api/v1/products/";
  const response = await request.get(url, { failOnStatusCode: true });

  return response;
}

// update a product (PUT)
async function updateProduct(request: APIRequestContext, updProduct: ProductData, productId: Number) {
  const response = await request.put(`/api/v1/products/${productId}`, {
    data: updProduct,
    failOnStatusCode: true,
  });

  const json = await response.json();
  return json;
}

// delete a product (DELETE)
async function deleteProduct(request: APIRequestContext, productId: Number) {
  const response = await request.delete(`/api/v1/products/${productId}`, { failOnStatusCode: true });

  return response;
}

//* TESTS STARTS HERE

// create a product (happy path) and schema validation
test("created product should be present and have proper fields && values", async ({ request }) => {
  //! ARRANGE
  //create a new product
  const jsonCreated = await createProduct(request, newProduct);
  // store some variables from created product
  const productId = jsonCreated.id;

  //! ACT
  // check if the created product can be read with GET request
  const getProdResponse = await readProduct(request, productId);
  const getProdResponseJson = await getProdResponse.json();

  // !ASSERT
  expect(getProdResponse.status()).toBe(200);
  expect(getProdResponse.statusText()).toBe("OK");
  expect(getProdResponseJson).toMatchObject({
    id: productId,
    title: newProduct.title,
    price: newProduct.price,
    description: newProduct.description,
    images: newProduct.images,
  });

  // Data teardown
  const delResponse = await deleteProduct(request, productId);
  expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
});

test("created product is present in the products list", async ({ request }) => {
  //! Arrange
  const jsonCreated = await createProduct(request, newProduct);
  const productId = jsonCreated.id;

  //! Act
  const getProdResponse = await readProduct(request);
  const getProdResponseJson = await getProdResponse.json();

  //! Assert
  const foundProd = getProdResponseJson.find((prod: ProductResponse) => prod.id === productId);
  expect(foundProd, `Product ${productId} was not found in the response`).toBeDefined();
  expect(foundProd).toMatchObject({
    id: productId,
    title: newProduct.title,
    price: newProduct.price,
    description: newProduct.description,
    images: newProduct.images,
  });

  // Data teardown
  const delResponse = await deleteProduct(request, productId);
  expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
});

test("updated product is present in the list with updated data", async ({ request }) => {
  //! Arrange
  const updatedProduct: ProductData = {
    title: `<UPDATED> Hogwarts castle LEGO #${randomNumber}`,
    price: 20,
    description: `<UPDATED> A description for Hogwarts castle LEGO #${randomNumber}`,
    categoryId: 2,
    images: ["https://updated.placehold.co/600x400"],
  };

  const jsonCreated = await createProduct(request, newProduct);
  const productId = jsonCreated.id;

  //! Act
  await updateProduct(request, updatedProduct, productId);

  //! Assert
  const getProdResponse = await readProduct(request, productId);
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

  // Data teardown
  const delResponse = await deleteProduct(request, productId);
  expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
});
