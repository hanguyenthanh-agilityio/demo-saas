import { test as base } from "@playwright/test";
import { TicketPage } from "../pages/ticket.page";
import { TicketAPI } from "../services/TicketAPI";

type Fixtures = {
  ticketPage: TicketPage;
  ticketAPI: TicketAPI;
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
});

export { expect } from "@playwright/test";
