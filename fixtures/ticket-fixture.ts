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

  ticketAPI: async ({ request }, use) => {
    await use(new TicketAPI(request));
  },
});

export { expect } from "@playwright/test";
