import { test, expect } from "../fixtures/ticket";

test.describe("Ticket Filter by Status", () => {
  const statuses = ["New", "In Progress", "Resolved", "Closed", "Any"] as const;

  test(
    "Verify user can filter tickets by status correctly",
    { tag: ["@ticket", "@filter", "@ui"] },
    async ({ ticketPage }) => {
      await test.step("Navigate to ticket page", async () => {
        await ticketPage.goto();
      });

      for (const status of statuses) {
        await test.step(`Filter tickets by status: ${status}`, async () => {
          await ticketPage.filterByStatus(status);
          await ticketPage.waitForTicketsTableReload();
        });

        await test.step("Verify filter UI state is correct", async () => {
          const selected = await ticketPage.statusSelect.inputValue();
          expect(selected.toLowerCase()).toBe(status.toLowerCase());
        });

        await test.step("Verify ticket statuses in table", async () => {
          await ticketPage.filterByStatus(status);
        });

        await test.step("Verify ticket statuses", async () => {
          const visibleStatuses = await ticketPage.getVisibleTicketStatuses();

          if (status === "Any") {
            expect(visibleStatuses.length).toBeGreaterThan(0);
            return;
          }

          const invalid = visibleStatuses.filter((s) => s.toLowerCase() !== status.toLowerCase());

          expect(invalid).toEqual([]);
        });
      }
    }
  );
});
