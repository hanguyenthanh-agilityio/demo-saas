import { test, expect } from "../fixtures/ticket-fixture";

test.describe("🔍 Ticket Search by Title", () => {
  const keyword = "Title 1";

  test("Verify user can search tickets by title", async ({ ticketPage }) => {
    await ticketPage.goto();

    await ticketPage.goToSearchPage();

    // Case insensitive
    await test.step("Case insensitive", async () => {
      await ticketPage.search("title 1");
      await ticketPage.expectAllTitlesMatch("title 1");
    });

    // Clear by button
    await test.step("Clear by button", async () => {
      await ticketPage.search(keyword);
      await ticketPage.clickClearSearchBtn();

      const rows = await ticketPage.getVisibleTickets().count();
      expect(rows).toBeGreaterThan(0);
    });
  });
});
