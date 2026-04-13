import { test, expect } from "../fixtures/ticket-fixture";

test.describe("Update Ticket Feature", () => {
  const title = `Title ${Date.now()}`;

  // =========================
  // TC013 - EDIT STATUS
  // =========================
  test(
    "TC013 - User can update ticket status and see the change immediately",
    { tag: ["@ticket", "@edit"] },
    async ({ ticketPage, page }) => {
      await test.step("User creates a new ticket", async () => {
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

      await test.step("User returns to ticket list", async () => {
        await ticketPage.goto();
        await ticketPage.waitForTicketsTableReload();
      });

      await test.step("User opens the ticket details", async () => {
        await ticketPage.openTicketByTitle(title);
      });

      await test.step("User changes status to In Progress", async () => {
        await Promise.all([
          page.waitForResponse(
            (res) =>
              res.url().includes("tickets.updateStatus") &&
              res.request().method() === "POST" &&
              res.status() === 200
          ),
          ticketPage.changeStatus("In Progress"),
        ]);

        await expect(ticketPage.updatedNowLabel).toBeVisible();
      });

      await test.step("User checks updated time tooltip", async () => {
        await ticketPage.updatedLabel.hover();
      });

      await test.step("User changes status to Resolved", async () => {
        await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes("tickets.updateStatus") && res.request().method() === "POST"
          ),
          ticketPage.changeStatus("Resolved"),
        ]);
      });

      await test.step("User changes status back to New and sees it updated", async () => {
        await ticketPage.changeStatus("New");

        const currentStatus = ticketPage.ticketDetailPopup
          .getByTestId("ticket-status-select")
          .locator(".mantine-Badge-label");

        await expect(currentStatus).toHaveText(/new/i);
      });
    }
  );

  test(
    "TC014 - User can add comments including special characters and see them in order",
    { tag: ["@ticket", "@comment"] },
    async ({ ticketPage, createdTicketTitle }) => {
      const comments = ["Hello", "@#$%", "Second comment"];

      await test.step("User opens the ticket details", async () => {
        await ticketPage.goto();
        await ticketPage.openTicketByTitle(createdTicketTitle);
      });

      await test.step("User adds multiple comments", async () => {
        for (const comment of comments) {
          await ticketPage.addComment(comment);
          await expect(ticketPage.getCommentItem(comment)).toBeVisible();
        }
      });

      await test.step("User sees all comments displayed in correct order (latest first)", async () => {
        const commentItems = ticketPage.ticketDetailPopup.locator("textarea[readonly]").filter({
          hasText: /Hello|@#\$%|Second comment/,
        });

        await expect(commentItems).toHaveCount(3);

        await expect(commentItems.nth(0)).toHaveValue("Second comment");
        await expect(commentItems.nth(1)).toHaveValue("@#$%");
        await expect(commentItems.nth(2)).toHaveValue("Hello");
      });
    }
  );

  test(
    "TC015 - User can close the ticket details by clicking X or outside the popup",
    { tag: ["@ticket", "@popup"] },
    async ({ ticketPage, createdTicketTitle }) => {
      await test.step("User opens the ticket details", async () => {
        await ticketPage.goto();
        await ticketPage.openTicketByTitle(createdTicketTitle);
      });

      await test.step("User closes the popup using the close (X) button", async () => {
        await ticketPage.closePopupByIcon();
      });

      await test.step("User opens the ticket details again", async () => {
        await ticketPage.openTicketByTitle(createdTicketTitle);
      });

      await test.step("User closes the popup by clicking outside", async () => {
        await ticketPage.closePopupByOutsideClick();
      });
    }
  );
});
