import { APIRequestContext } from "@playwright/test";
import { ProductData, ProductResponse } from "../types/products";
import * as productsCrud from "./products-crud";

export async function findProductsBySubString(request: APIRequestContext, prodSubString: string) {
  const productsResponse = await productsCrud.readProduct(request);
  const productsJson: ProductData[] = await productsResponse.json();
  const filteredProductsArray = productsJson.filter((product) => product.title.includes(prodSubString)).map((product) => product.id!);

  return filteredProductsArray;
}
