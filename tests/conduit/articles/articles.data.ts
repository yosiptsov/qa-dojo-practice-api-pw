import { ArticlePayload } from "../../../app/conduit/json-schemas/Articles";
import { faker } from "@faker-js/faker";

export const newArticle: ArticlePayload = {
  article: {
    author: {},
    title: `YO Article about ${faker.book.title()}`,
    description: `This book was wrote by ${faker.book.author()}.`,
    body: `This book was wrote by ${faker.book.author()}. And by published by ${faker.book.publisher()}.`,
    tagList: ["yo", "books"],
  },
};

export const updatedArticle: ArticlePayload = {
  article: {
    author: {},
    title: `YO Article about ${faker.book.title()} - UPDATED`,
    description: `This book was wrote by ${faker.book.author()}. - UPDATED`,
    body: `This book was wrote by ${faker.book.author()}. And by published by ${faker.book.publisher()}. - UPDATED`,
    tagList: ["yo", "books", "updated"],
  },
};
