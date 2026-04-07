import { APIRequestContext } from "@playwright/test";

export interface CreateTicketInput {
  name: string;
  title: string;
  description: string;
}

export class TicketAPI {
  constructor(private request: APIRequestContext) {}

  async create(input: CreateTicketInput) {
    const res = await this.request.post("/api/trpc/tickets.create?batch=1", {
      data: {
        0: {
          json: input,
        },
      },
    });

    const body = await res.json();

    const result = body?.[0]?.result?.data?.json;

    return {
      status: res.status(),
      data: result,
    };
  }

  async getList({ status }: { status: string }) {
    const input = { 0: { json: { status } } };
    const url = `/api/trpc/tickets.getList?batch=1&input=${encodeURIComponent(JSON.stringify(input))}`;
    const res = await this.request.get(url);
    const body = await res.json();
    const tickets = body?.[0]?.result?.data || [];
    return { status: res.status(), data: tickets };
  }
}
