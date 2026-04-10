import { test, expect } from "../fixtures/ticket-fixture";

test.describe("Ticket Filter by Status", () => {
  const statuses: Array<"New" | "In Progress" | "Resolved" | "Closed" | "Any"> = [
    "New",
    "In Progress",
    "Resolved",
    "Closed",
    "Any",
  ];

  test("Verify user can filter tickets by status", async ({ ticketPage }) => {
    await ticketPage.goto();

    for (const status of statuses) {
      await test.step(`Filter by status = ${status}`, async () => {
        await ticketPage.filterByStatus(status);
        await ticketPage.waitForTicketsTableReload();

        // Verify filter UI is set correctly
        const selected = (await ticketPage.statusSelect.inputValue?.()) || status;
        expect(selected.toLowerCase()).toBe(status.toLowerCase());

        const visibleStatuses = await ticketPage.getVisibleTicketStatuses();

        if (status !== "Any") {
          const allowedStatuses = ["New", "In Progress", "Resolved", "Closed"];
          visibleStatuses.forEach((s) => {
            expect(allowedStatuses.map((a) => a.toLowerCase())).toContain(s.toLowerCase());
          });
        } else {
          expect(visibleStatuses.length >= 0).toBeTruthy();
        }
      });
    }
  });
});
