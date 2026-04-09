import { test, expect } from "../fixtures/ticket-fixture";

function expectSortedAsc(arr: string[]) {
  const sorted = [...arr].sort((a, b) => a.localeCompare(b));
  expect(arr).toEqual(sorted);
}

test.describe("Ticket Sort Feature", () => {
  // =========================
  // TC030 - SORT BY TITLE
  // =========================
  test(
    "TC030 - Verify user can sort tickets by Title",
    { tag: ["@ticket", "@sort", "@smoke"] },
    async ({ ticketPage }) => {
      let defaultTitles: string[] = [];
      let ascTitles: string[] = [];

      await test.step("Step 1: Navigate to Ticket List and Sort page", async () => {
        await ticketPage.goto();
        await ticketPage.goToSortPage();
      });

      await test.step("Step 2: Capture default ticket titles before sorting", async () => {
        defaultTitles = await ticketPage.getTicketTitles();
        expect(defaultTitles.length).toBeGreaterThan(0);
      });

      await test.step("Step 3: Click Title column header to sort tickets in ascending order", async () => {
        await ticketPage.sortByTitle();

        const { titles, url } = await ticketPage.getTitlesAndUrl();
        ascTitles = titles;

        expect(url).toContain("sortBy=title");
        expect(url).toContain("order=asc");

        expectSortedAsc(ascTitles);
      });

      await test.step("Step 4: Click Title column header again to reset sorting to default server order", async () => {
        await ticketPage.sortByTitle();

        const { titles, url } = await ticketPage.getTitlesAndUrl();

        expect(url).toContain("sortBy=title");
        expect(url).not.toContain("order=");

        expect(titles).not.toEqual(ascTitles);
      });
    }
  );
});
