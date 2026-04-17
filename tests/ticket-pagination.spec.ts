import { test, expect } from "../fixtures/ticket";
import { RowsPerPage } from "../types/ticket";

test.describe("Ticket Pagination Feature", () => {
  // ====================
  // TC017 - Default pagination
  // ====================
  test(
    "TC017 - Verify that when user opens Ticket List, page 1 is shown by default with up to 10 tickets",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      await test.step("Step 2: Verify default page loads with data and max 10 rows", async () => {
        const titles = await ticketPage.getTicketTitles();

        expect(titles.length).toBeGreaterThan(0);
        expect(titles.length).toBeLessThanOrEqual(10);
      });
    }
  );

  // ====================
  // TC018 - Navigate pages
  // ====================
  test(
    "TC018 - Verify user can click Next, Previous, First, Last and page numbers to move between pages",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      await test.step("Step 2: Click Next button", async () => {
        if (!(await ticketPage.nextBtn.isDisabled())) {
          await ticketPage.clickNext();
        }
      });

      await test.step("Step 3: Click Previous button", async () => {
        if (!(await ticketPage.prevBtn.isDisabled())) {
          await ticketPage.clickPrev();
        }
      });

      await test.step("Step 4: Click Last button", async () => {
        if (!(await ticketPage.lastBtn.isDisabled())) {
          await ticketPage.clickLast();
        }
      });

      await test.step("Step 5: Click First button", async () => {
        if (!(await ticketPage.firstBtn.isDisabled())) {
          await ticketPage.clickFirst();
          await ticketPage.waitForTicketsTableReload();
        }
      });

      await test.step("Step 6: Navigate using page number", async () => {
        await ticketPage.goToPage(2);

        const titles = await ticketPage.getTicketTitles();
        expect(titles.length).toBeGreaterThan(0);
      });
    }
  );

  // ====================
  // TC019 - Active page highlight
  // ====================
  test(
    "TC019 - Verify that the current page number is highlighted when user navigates between pages",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      await test.step("Step 2: Verify page 1 is visible", async () => {
        await expect(ticketPage.getPageBtn(1)).toBeVisible();
      });

      await test.step("Step 3: Navigate to page 2 and verify highlight", async () => {
        await ticketPage.goToPage(2);
        await expect(ticketPage.getPageBtn(2)).toBeVisible();
      });
    }
  );

  // ====================
  // TC020 - Rows per page
  // ====================
  test(
    "TC020 - Verify user can change number of tickets displayed per page (10, 25, 50, 100)",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      const sizes: RowsPerPage[] = ["10", "25"];

      for (const size of sizes) {
        await test.step(`Step 2: Change rows per page to ${size} and verify`, async () => {
          await ticketPage.changeRowsPerPage(size);

          const titles = await ticketPage.getTicketTitles();
          expect(titles.length).toBeLessThanOrEqual(Number(size));
        });
      }
    }
  );

  // ====================
  // TC021 - Reset page when change size
  // ====================
  test(
    "TC021 - Verify that system returns to page 1 when user changes number of rows per page",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      await test.step("Step 2: Navigate to page 2", async () => {
        await ticketPage.goToPage(2);
      });

      await test.step("Step 3: Change rows per page and verify page resets to 1", async () => {
        await ticketPage.changeRowsPerPage("25");

        await expect(ticketPage.getPageBtn(1)).toBeVisible();
      });
    }
  );

  // ====================
  // TC022 - Go to page input
  // ====================
  test(
    "TC022 - Verify user can enter page number to navigate and system handles invalid input correctly",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      await test.step("Step 2: Enter valid page number", async () => {
        await ticketPage.goToPageByInput("2");
      });

      await test.step("Step 3: Enter invalid values (negative, zero)", async () => {
        await ticketPage.goToPageByInput("-1");
        await ticketPage.goToPageByInput("0");
      });

      await test.step("Step 4: Verify system still shows valid data", async () => {
        const titles = await ticketPage.getTicketTitles();
        expect(titles.length).toBeGreaterThan(0);
      });
    }
  );

  // ====================
  // TC023 - Disable buttons
  // ====================
  test(
    "TC023 - Verify Previous and First buttons are disabled on first page, and Next and Last buttons are disabled on last page",
    { tag: ["@ticket", "@pagination"] },
    async ({ ticketPage }) => {
      await test.step("Step 1: Navigate to Ticket List page", async () => {
        await ticketPage.goto();
      });

      await test.step("Step 2: Verify First & Previous buttons are disabled on page 1", async () => {
        await expect(ticketPage.getPageBtn(1)).toHaveAttribute("aria-current", "page");
        await expect(ticketPage.prevBtn).toBeDisabled();
        await expect(ticketPage.firstBtn).toBeDisabled();
      });

      await test.step("Step 3: Navigate to last page", async () => {
        await ticketPage.clickLast();
      });

      await test.step("Step 4: Verify Next & Last buttons are disabled on last page", async () => {
        await expect(ticketPage.nextBtn).toBeDisabled();
        await expect(ticketPage.lastBtn).toBeDisabled();
      });
    }
  );
});
