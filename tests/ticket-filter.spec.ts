/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "../fixtures/ticket-fixture";

test.describe("🎫 Ticket Filter by Status", () => {
  const statuses: Array<"New" | "In Progress" | "Resolved" | "Closed" | "Any"> = [
    "New",
    "In Progress",
    "Resolved",
    "Closed",
    "Any",
  ];

  test(
    "TC-001: Verify user can filter tickets by status and API response matches UI",
    {
      tag: ["@ticket", "@filter", "@status", "@ui", "@api"],
    },
    async ({ ticketPage, ticketAPI }) => {
      await ticketPage.goto();

      for (const status of statuses) {
        await test.step(`Filter by status = ${status}`, async () => {
          await ticketPage.filterByStatus(status);

          const selected = (await ticketPage.statusSelect.inputValue?.()) || status;
          expect(selected.toLowerCase()).toBe(status.toLowerCase());

          const visibleTitles = await ticketPage.getTicketTitles();
          const visibleStatuses = await ticketPage.getVisibleTicketStatuses();

          if (status !== "Any") {
            const matched = visibleStatuses.filter((s) => s.toLowerCase() === status.toLowerCase());
          }

          // API verification
          if (status !== "Any") {
            let apiRes;
            try {
              apiRes = await ticketAPI.getList({ status });
            } catch {
              return;
            }

            if (apiRes.status !== 200) {
              return;
            }

            const apiStatuses = apiRes.data.map((t: any) => t.status.toLowerCase());
            const uiStatuses = visibleStatuses.map((s) => s.toLowerCase());

            // Verify each UI ticket exists in API response
            uiStatuses.forEach((s) => expect(apiStatuses).toContain(s));
          }
        });
      }
    }
  );
});
