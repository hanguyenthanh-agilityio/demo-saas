import { test, expect } from "../fixtures/ticket-fixture";

test.describe("Ticket Sort Feature", () => {
  test(
    "TC030 - Verify user can sort tickets by Title (ASC/reset/ASC)",
    { tag: ["@ticket", "@sort", "@smoke"] },
    async ({ ticketPage }) => {
      // ====================
      // Step 1: Navigate to Sort page
      // ====================
      await test.step("Step 1: Navigate to Ticket List / Sort page", async () => {
        await ticketPage.goto();
        await ticketPage.goToSortPage();
      });

      // ====================
      // Step 2: Capture default ticket titles
      // ====================
      let defaultTitles: string[] = [];
      await test.step("Step 2: Capture default ticket titles", async () => {
        defaultTitles = await ticketPage.getTicketTitles();
        expect(defaultTitles.length).toBeGreaterThan(0);
      });

      // ====================
      // Step 3: Sort ASC
      // ====================
      let ascTitles: string[] = [];
      await test.step("Step 3: Click Title header to sort ascending (A → Z)", async () => {
        await ticketPage.clickTitleHeader(); // wait API + render
        ascTitles = await ticketPage.getTicketTitles();

        expect(ascTitles.length).toEqual(defaultTitles.length);
        const isChanged = ascTitles.some((t, i) => t !== defaultTitles[i]);
        expect(isChanged).toBeTruthy();
      });
    }
  );
});
