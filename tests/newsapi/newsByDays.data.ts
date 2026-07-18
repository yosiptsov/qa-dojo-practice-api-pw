import { expect } from "@playwright/test";

const oneDayAgo = new Date();
const twoDaysAgo = new Date();
const threeDaysAgo = new Date();
const fourDaysAgo = new Date();

const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const days = {
  oneDayAgo: getPastDate(1),
  twoDaysAgo: getPastDate(2),
  threeDaysAgo: getPastDate(3),
  fourDaysAgo: getPastDate(4),
};

export const searchParams = [
  {
    day: "one day ago",
    title: "FIFA",
    date: days.oneDayAgo,
    expectLength: (json: any) => expect(json.articles.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.articles[0].publishedAt.split("T")[0]).toBe(days.oneDayAgo),
    expectDescription: (json: any) => expect(json.articles[0].description).toContain("FIFA"),
  },
  {
    day: "two days ago",
    title: "FIFA",
    date: days.twoDaysAgo,
    expectLength: (json: any) => expect(json.articles.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.articles[0].publishedAt.split("T")[0]).toBe(days.twoDaysAgo),
    expectDescription: (json: any) => expect(json.articles[0].description).toContain("FIFA"),
  },
  {
    day: "three days ago",
    title: "FIFA",
    date: days.threeDaysAgo,
    expectLength: (json: any) => expect(json.articles.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.articles[0].publishedAt.split("T")[0]).toBe(days.threeDaysAgo),
    expectDescription: (json: any) => expect(json.articles[0].description).toContain("FIFA"),
  },
  {
    day: "four day ago",
    title: "FIFA",
    date: days.fourDaysAgo,
    expectLength: (json: any) => expect(json.articles.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.articles[0].publishedAt.split("T")[0]).toBe(days.fourDaysAgo),
    expectDescription: (json: any) => expect(json.articles[0].description).toContain("FIFA"),
  },
];
