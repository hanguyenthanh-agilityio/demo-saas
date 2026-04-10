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

      await test.step("Step 2: Enter exact ticket title into search input and verify all visible results exactly match it", async () => {
        await ticketPage.search(keywords.exact);
        await ticketPage.expectAllTitlesMatch(keywords.exact);
      });

      await test.step("Step 3: Enter partial keyword into search input and verify all visible results contain that keyword", async () => {
        await ticketPage.search(keywords.partial);
        await ticketPage.expectAllTitlesMatch(keywords.partial);
      });

      await test.step("Step 4: Enter ticket title in different case and verify search is case-insensitive", async () => {
        await ticketPage.search(keywords.caseInsensitive);
        await ticketPage.expectAllTitlesMatch(keywords.caseInsensitive);
      });

      await test.step("Step 5: Enter ticket title with leading/trailing spaces and verify results match trimmed value", async () => {
        await ticketPage.search(keywords.trimmed);
        await ticketPage.expectAllTitlesMatch(keywords.trimmed.trim());
      });

      await test.step("Step 6: Enter a keyword that matches no tickets and verify empty state is shown", async () => {
        await ticketPage.search(keywords.emptyResult);

        const emptyVisible = await ticketPage.emptyState.isVisible();
        expect(emptyVisible).toBeTruthy();
      });

      await test.step("Step 7: Clear the search input and verify all tickets are visible again", async () => {
        await ticketPage.clearSearch();
        await ticketPage.waitForTicketsTableReload();

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

      await test.step("Step 2: Enter exact ticket title into search input to filter results", async () => {
        await ticketPage.search(keywords.exact);
        await ticketPage.expectAllTitlesMatch(keywords.exact);
      });

      await test.step("Step 3: Click the Clear Search button to reset the search input", async () => {
        await ticketPage.clickClearSearchBtn();
      });

      await test.step("Step 4: Verify that all tickets are visible after clearing the search input", async () => {
        const rows = await ticketPage.getVisibleTickets().count();
        expect(rows).toBeGreaterThan(0);
      });
    }
  );
});
