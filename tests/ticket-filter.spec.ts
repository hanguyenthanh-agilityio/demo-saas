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

      await test.step("Reset filter to Any", async () => {
        await ticketPage.filterByStatus("Any");
        await ticketPage.waitForTicketsTableReload();
      });

      for (const status of statuses) {
        await test.step(`Filter tickets by status: ${status}`, async () => {
          await ticketPage.filterByStatus(status);
          await ticketPage.waitForTicketsTableReload();
        });

        await test.step("Verify filter UI state is correct", async () => {
          const selected = await ticketPage.page.getByTestId("ticket-status-select").inputValue();

          expect(selected.toLowerCase()).toBe(status.toLowerCase());
        });

        await test.step("Verify ticket statuses in table", async () => {
          if (status === "Any") {
            const visibleStatuses = await ticketPage.getVisibleTicketStatuses();
            expect(visibleStatuses.length).toBeGreaterThan(0);
            return;
          }

          await expect
            .poll(
              async () => {
                const visibleStatuses = await ticketPage.getVisibleTicketStatuses();

                const invalid = visibleStatuses.filter(
                  (s) => s.toLowerCase() !== status.toLowerCase()
                );

                return invalid.length;
              },
              {
                timeout: 10000,
                message: `Waiting for all tickets to be ${status}`,
              }
            )
            .toBe(0);
        });
      }
    }
  );
});
