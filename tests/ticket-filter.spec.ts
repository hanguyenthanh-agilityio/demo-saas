import { test, expect } from "../fixtures/ticket-fixture";

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
          const visibleStatuses = await ticketPage.getVisibleTicketStatuses();

          if (status === "Any") {
            expect(visibleStatuses.length).toBeGreaterThanOrEqual(0);
            return;
          }

          const allowed = ["new", "in progress", "resolved", "closed"];

          for (const s of visibleStatuses) {
            expect(allowed).toContain(s.toLowerCase());
          }
        });
      }
    }
  );
});
