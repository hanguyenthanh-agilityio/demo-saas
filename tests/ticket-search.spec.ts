import { test, expect } from "../fixtures/ticket-fixture";

test.describe("Ticket Search Feature", () => {
  const keywords = {
    exact: "Title 1",
    partial: "Tit",
    caseInsensitive: "title 1",
    trimmed: " Title 1 ",
    emptyResult: "xyz123",
  };

  // =========================
  // TC024 - SEARCH TICKETS
  // =========================
  test(
    "TC024 - Verify user can search tickets by title (exact, partial, case-insensitive, trimmed, empty)",
    { tag: ["@ticket", "@search"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List and Search page", async () => {
        await ticketPage.goto();
        await ticketPage.goToSearchPage();
      });

      await test.step("Step 2: Exact match search", async () => {
        await ticketPage.search(keywords.exact);
        await ticketPage.expectAllTitlesMatch(keywords.exact);
      });

      await test.step("Step 3: Partial match search", async () => {
        await ticketPage.search(keywords.partial);
        await ticketPage.expectAllTitlesMatch(keywords.partial);
      });

      await test.step("Step 4: Case-insensitive search", async () => {
        await ticketPage.search(keywords.caseInsensitive);
        await ticketPage.expectAllTitlesMatch(keywords.caseInsensitive);
      });

      await test.step("Step 5: Trimmed input search", async () => {
        await ticketPage.search(keywords.trimmed);
        await ticketPage.expectAllTitlesMatch(keywords.trimmed.trim());
      });

      await test.step("Step 6: No results search", async () => {
        await ticketPage.search(keywords.emptyResult);

        const emptyVisible = await ticketPage.emptyState.isVisible();
        expect(emptyVisible).toBeTruthy();
      });

      await test.step("Step 7: Clear input by filling empty", async () => {
        await ticketPage.clearSearch();

        const rows = await ticketPage.getVisibleTickets().count();
        expect(rows).toBeGreaterThan(0);
      });
    }
  );

  // =========================
  // TC025 - CLEAR INPUT BUTTON
  // =========================
  test(
    "TC025 - Verify Clear Search button resets ticket list",
    { tag: ["@ticket", "@search", "@clear"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List and Search page", async () => {
        await ticketPage.goto();
        await ticketPage.goToSearchPage();
      });

      await test.step("Step 2: Perform a search to populate results", async () => {
        await ticketPage.search(keywords.exact);
        await ticketPage.expectAllTitlesMatch(keywords.exact);
      });

      await test.step("Step 3: Click Clear Search button", async () => {
        await ticketPage.clickClearSearchBtn();
      });

      await test.step("Step 4: Verify all tickets are visible after clearing", async () => {
        const rows = await ticketPage.getVisibleTickets().count();
        expect(rows).toBeGreaterThan(0);
      });
    }
  );
});
