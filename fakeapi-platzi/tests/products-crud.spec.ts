import { test, expect, APIRequestContext } from "@playwright/test";
import * as ProductsCrud from "../src/utils/products-crud";
import { ProductData, ProductResponse } from "../src/types/products";
import { TAG } from "./tags";

import * as ProductsSearch from "../src/utils/products-search";

// prepare a random test data
const randomNumber = Math.floor(Math.random() * 10000);

const newProduct: ProductData = {
  title: `Hogwarts castle LEGO #${randomNumber}`,
  price: 10,
  description: `A description for Hogwarts castle LEGO #${randomNumber}`,
  categoryId: 1,
  images: ["https://placehold.co/600x400"],
};

test.describe("created product should: ", { tag: [TAG.product, TAG.create, TAG.positive] }, () => {
  // common variables
  let productId: number;

  test.beforeAll(async ({ request }) => {
    const findOldTestProducts = await ProductsSearch.findProductsBySubString(request, "Hogwarts castle LEGO");

    if (findOldTestProducts.length > 0) await ProductsCrud.deleteAllProducts(request, findOldTestProducts);
    console.log("Наступні продукти були видалені: ", findOldTestProducts);
  });

  test.beforeEach(async ({ request }) => {
    //! Arrange
    //create a new product
    const jsonCreated = await ProductsCrud.createProduct(request, newProduct);
    // store some variables from created product
    productId = jsonCreated.id;
  });

  test.afterEach(async ({ request }) => {
    // Data teardown
    const delResponse = await ProductsCrud.deleteProduct(request, productId);
    expect(delResponse.status(), `Product id = ${productId} was not deleted!`).toBe(200);
  });

  test("be present and have proper fields && values", async ({ request }) => {
    //! ACT
    // check if the created product can be read with GET request
    const getProdResponse = await ProductsCrud.readProduct(request, productId);
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
  });

  test("be present in the products list", async ({ request }) => {
    //! Act
    const getProdResponse = await ProductsCrud.readProduct(request);
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

    //! Act
    await ProductsCrud.updateProduct(request, updatedProduct, productId);

    //! Assert
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
