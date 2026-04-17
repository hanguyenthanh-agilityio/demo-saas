import { test as base, expect } from "@playwright/test";
import { TicketPage } from "../pages/ticket";

type Fixtures = {
  ticketPage: TicketPage;
  createdTicketTitle: string;
};

export const test = base.extend<Fixtures>({
  ticketPage: async ({ page }, use) => {
    await use(new TicketPage(page));
  },

  createdTicketTitle: async ({ ticketPage }, use) => {
    const title = `Title ${Date.now()}`;

    await ticketPage.goto();
    await ticketPage.openCreate();

    await ticketPage.fillForm({
      name: "Joe",
      title,
      description: "Test update",
    });

    await ticketPage.submit();

    await expect(ticketPage.successMsg).toBeVisible();

    await ticketPage.goto();
    await ticketPage.waitForTicketsTableReload();

    await use(title);
  },
});

export { expect } from "@playwright/test";
