import { test as base, expect } from "@playwright/test";
import { TicketPage } from "../pages/ticket.page";
import { TicketAPI } from "../services/TicketAPI";

type Fixtures = {
  ticketPage: TicketPage;
  ticketAPI: TicketAPI;
  createdTicketTitle: string;
};

export const test = base.extend<Fixtures>({
  ticketPage: async ({ page }, use) => {
    await use(new TicketPage(page));
  },

  ticketAPI: async ({ page, playwright }, use) => {
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

    const apiRequest = await playwright.request.newContext({
      baseURL: "https://demo-saas.bugbug.io",
      extraHTTPHeaders: {
        cookie: cookieHeader,
      },
    });

    await use(new TicketAPI(apiRequest));
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
    await ticketPage.waitForTicketsOrEmpty();

    await use(title);
  },
});

export { expect } from "@playwright/test";
