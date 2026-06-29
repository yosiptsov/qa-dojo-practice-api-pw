// set a new type for payload Product
export type ProductData = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

// set a new type for response Product and included obj category
export type Category = {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};

export type ProductResponse = {
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
