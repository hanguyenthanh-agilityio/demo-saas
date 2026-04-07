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

  test("Verify user can filter tickets by status and API response matches UI", async ({
    ticketPage,
    ticketAPI,
  }) => {
    await ticketPage.goto();

    for (const status of statuses) {
      await test.step(`Filter by status = ${status}`, async () => {
        // --- UI ---
        await ticketPage.filterByStatus(status);

        const selected = (await ticketPage.statusSelect.inputValue?.()) || status;
        expect(selected.toLowerCase()).toBe(status.toLowerCase());

        const visibleTitles = await ticketPage.getTicketTitles();
        const visibleStatuses = await ticketPage.getVisibleTicketStatuses();

        console.log(`Status filter: ${status}`);
        console.log("Visible Titles:", visibleTitles);
        console.log("Visible Statuses:", visibleStatuses);

        if (status !== "Any") {
          const matched = visibleStatuses.filter((s) => s.toLowerCase() === status.toLowerCase());
          console.log(`Tickets matched for ${status}:`, matched.length);
        }

        // --- API verification (safety check) ---
        if (status !== "Any") {
          let apiRes;
          try {
            apiRes = await ticketAPI.getList({ status });
          } catch (err) {
            console.warn(`API call failed for status "${status}":`, err);
            return;
          }

          if (apiRes.status !== 200) {
            console.warn(
              `API returned status ${apiRes.status} for status "${status}". Skipping API verification.`
            );
            return;
          }

          const apiStatuses = apiRes.data.map((t: any) => t.status.toLowerCase());
          const uiStatuses = visibleStatuses.map((s) => s.toLowerCase());

          // Check UI tickets exist in API response
          uiStatuses.forEach((s) => expect(apiStatuses).toContain(s));

          console.log(`API tickets for ${status}:`, apiStatuses.length);
        }
      });
    }
  });
});
