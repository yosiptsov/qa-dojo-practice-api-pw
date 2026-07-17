import { expect } from "@playwright/test";

const oneDayAgo = new Date();
const twoDaysAgo = new Date();
const threeDaysAgo = new Date();
const fourDaysAgo = new Date();

const days = {
  oneDayAgo: oneDayAgo.setDate(oneDayAgo.getDate() - 1),
  twoDaysAgo: twoDaysAgo.setDate(twoDaysAgo.getDate() - 2),
  threeDaysAgo: threeDaysAgo.setDate(threeDaysAgo.getDate() - 3),
  fourDaysAgo: fourDaysAgo.setDate(fourDaysAgo.getDate() - 4),
};

export const searchParams = [
  {
    day: "one day ago",
    title: "FIFA",
    date: days.oneDayAgo,
    expectLength: (json: any) => expect(json.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.publishedAt).toBeGreaterThanOrEqual(days.oneDayAgo),
  },
  {
    day: "two days ago",
    title: "FIFA",
    date: days.twoDaysAgo,
    expectLength: (json: any) => expect(json.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.publishedAt).toBeGreaterThanOrEqual(days.twoDaysAgo),
  },
  {
    day: "three days ago",
    title: "FIFA",
    date: days.threeDaysAgo,
    expectLength: (json: any) => expect(json.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.publishedAt).toBeGreaterThanOrEqual(days.threeDaysAgo),
  },
  {
    day: "four day ago",
    title: "FIFA",
    date: days.fourDaysAgo,
    expectLength: (json: any) => expect(json.length).toBeGreaterThanOrEqual(0),
    expectPublishedDate: (json: any) => expect(json.publishedAt).toBeGreaterThanOrEqual(days.fourDaysAgo),
  },
];
