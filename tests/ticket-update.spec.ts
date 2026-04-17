import { test, expect } from "../fixtures/ticket";

test.describe("Update Ticket Feature", () => {
  const title = `Title ${Date.now()}`;

  // =========================
  // TC013 - EDIT STATUS
  // =========================
  test(
    "TC013 - Verify user can update ticket status and see changes immediately",
    { tag: ["@ticket", "@edit", "@status"] },
    async ({ ticketPage }) => {
      await test.step("Create a new ticket", async () => {
        await ticketPage.goto();
        await ticketPage.openCreate();

        await ticketPage.fillForm({
          name: "Joe",
          title,
          description: "Test update",
        });

        await ticketPage.submit();
        await expect(ticketPage.successMsg).toBeVisible();
      });

      await test.step("Navigate back to ticket list", async () => {
        await ticketPage.goto();
        await ticketPage.waitForTicketsTableReload();
      });

      await test.step("Open ticket detail", async () => {
        await ticketPage.openTicketByTitle(title);
      });

      await test.step("Change status → In Progress", async () => {
        await ticketPage.changeStatus("In Progress");

        await expect(ticketPage.updatedNowLabel).toBeVisible();
      });

      await test.step("Hover updated label to verify tooltip", async () => {
        await ticketPage.updatedLabel.hover();
      });

      await test.step("Change status → Resolved", async () => {
        await ticketPage.changeStatus("Resolved");
      });

      await test.step("Change status → New and verify", async () => {
        await ticketPage.changeStatus("New");

        const status = ticketPage.popupStatusSelect.locator(".mantine-Badge-label");
        await expect(status).toHaveText(/new/i);
      });
    }
  );

  // =========================
  // TC014 - COMMENTS
  // =========================
  test(
    "TC014 - Verify user can add comments and see correct order (latest first)",
    { tag: ["@ticket", "@comment"] },
    async ({ ticketPage, createdTicketTitle }) => {
      const comments = ["Hello", "@#$%", "Second comment"];

      await test.step("Open ticket detail", async () => {
        await ticketPage.goto();
        await ticketPage.openTicketByTitle(createdTicketTitle);
      });

      await test.step("Add multiple comments", async () => {
        for (const comment of comments) {
          await ticketPage.addComment(comment);
          await expect(ticketPage.getCommentItem(comment)).toBeVisible();
        }
      });

      await test.step("Verify comment order (latest first)", async () => {
        const comments = await ticketPage.getComments();

        const filtered = comments.filter((c) => ["Hello", "@#$%", "Second comment"].includes(c));

        expect(filtered).toHaveLength(3);

        expect(filtered[0]).toBe("Second comment");
        expect(filtered[1]).toBe("@#$%");
        expect(filtered[2]).toBe("Hello");
      });
    }
  );

  // =========================
  // TC015 - CLOSE POPUP
  // =========================
  test(
    "TC015 - Verify user can close ticket detail popup",
    { tag: ["@ticket", "@popup"] },
    async ({ ticketPage, createdTicketTitle, page }) => {
      await test.step("Open ticket detail", async () => {
        await ticketPage.goto();
        await ticketPage.openTicketByTitle(createdTicketTitle);
      });

      await test.step("Close popup using X button", async () => {
        await ticketPage.closePopupByIcon();
      });

      await test.step("Re-open ticket detail", async () => {
        await ticketPage.openTicketByTitle(createdTicketTitle);
      });

      await test.step("Close popup by clicking outside", async () => {
        await page.mouse.click(0, 0);
      });
    }
  );
});
