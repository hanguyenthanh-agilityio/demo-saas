import { test, expect } from "../fixtures/ticket";
import { CreateTicketTRPC } from "../types/ticket";

test.describe("Ticket Feature", () => {
  // =========================
  // TC009 - CREATE
  // =========================
  test(
    "TC009 - Verify user can create ticket successfully via UI and API",
    {
      tag: ["@ticket", "@create", "@smoke"],
    },
    async ({ ticketPage, page }) => {
      const data = {
        name: "Joe",
        title: `Title ${Date.now()}`,
        description: "Desc",
      };

      let apiResponse: CreateTicketTRPC;

      await test.step("Navigate to ticket page", async () => {
        await ticketPage.goto();
      });

      await test.step("Open create ticket form", async () => {
        await ticketPage.openCreate();
      });

      await test.step("Submit form and capture API response", async () => {
        const responsePromise = page.waitForResponse(
          (res) => res.request().method() === "POST" && res.url().includes("tickets.create")
        );

        await ticketPage.fillForm(data);
        await ticketPage.submit();

        const response = await responsePromise;

        apiResponse = (await response.json()) as CreateTicketTRPC;
      });

      await test.step("Step 4: Verify API response", async () => {
        const result = apiResponse[0]?.result?.data?.json;

        expect(result).toBeTruthy();

        expect(result?.title).toBe(data.title);

        expect(result?.id).toBeDefined();
      });

      await test.step("Step 5: Verify success message UI", async () => {
        await expect(ticketPage.successMsg).toBeVisible();
        // await expect(ticketPage.successMsg).toHaveText("Something wrong");
      });
    }
  );

  // ==============================
  // TC010 - REQUIRED FIELD VALIDATION
  // ==============================
  const validationCases = [
    { name: "", title: "valid", description: "valid", field: "name" },
    { name: "valid", title: "", description: "valid", field: "title" },
    { name: "valid", title: "valid", description: "", field: "description" },
    { name: "", title: "", description: "", field: "all" },
  ];

  for (const c of validationCases) {
    test(
      `TC010 - Verify validation when ${c.field} is empty`,
      { tag: ["@ticket", "@validation"] },
      async ({ ticketPage, page }) => {
        await test.step("Step 1: Open create page", async () => {
          await ticketPage.goto();
          await ticketPage.openCreate();
        });

        await test.step("Fill partial data", async () => {
          if (c.name) await ticketPage.nameInput.fill(c.name);
          if (c.title) await ticketPage.titleInput.fill(c.title);
          if (c.description) await ticketPage.descInput.fill(c.description);
        });

        await test.step("Submit", async () => {
          await ticketPage.submit();
        });

        await test.step("Verify validation UI", async () => {
          const errors = page.getByText(/must contain at least/i);

          await expect(errors.first()).toBeVisible();

          if (c.field === "all") {
            await expect(errors).toHaveCount(3);
          } else {
            await expect(errors.count()).resolves.toBeGreaterThanOrEqual(1);
          }
        });
      }
    );
  }
});
