import { test, expect } from "../fixtures/ticket-fixture";

test.describe("🔍 Ticket Search by Title", () => {
  const keywords = {
    exact: "Title 1",
    partial: "Tit",
    caseInsensitive: "title 1",
    trimmed: " Title 1 ",
    emptyResult: "xyz123",
  };

  test("Verify user can search tickets by title", async ({ ticketPage }) => {
    await ticketPage.goto();
    await ticketPage.goToSearchPage();

    await test.step("Exact match", async () => {
      await ticketPage.search(keywords.exact);
      await ticketPage.expectAllTitlesMatch(keywords.exact);
    });

    await test.step("Partial match", async () => {
      await ticketPage.search(keywords.partial);
      await ticketPage.expectAllTitlesMatch(keywords.partial);
    });

    await test.step("Case insensitive", async () => {
      await ticketPage.search(keywords.caseInsensitive);
      await ticketPage.expectAllTitlesMatch(keywords.caseInsensitive);
    });

    await test.step("Trimmed match", async () => {
      await ticketPage.search(keywords.trimmed);
      await ticketPage.expectAllTitlesMatch(keywords.trimmed.trim());
    });

    await test.step("No results", async () => {
      await ticketPage.search(keywords.emptyResult);

      const emptyVisible = await ticketPage.emptyState.isVisible();
      expect(emptyVisible).toBeTruthy();
    });

    await test.step("Clear input (fill empty)", async () => {
      await ticketPage.clearSearch();

      const rows = await ticketPage.getVisibleTickets().count();
      expect(rows).toBeGreaterThan(0);
    });
  });

  test("Clear input by button", async ({ ticketPage }) => {
    await ticketPage.goto();
    await ticketPage.goToSearchPage();

    await ticketPage.search(keywords.exact);
    await ticketPage.clickClearSearchBtn();

    const rows = await ticketPage.getVisibleTickets().count();
    expect(rows).toBeGreaterThan(0);
  });
});
