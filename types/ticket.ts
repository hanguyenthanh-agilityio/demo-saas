type Ticket = {
  id: string;
  name: string;
  title: string;
  description: string;
};

type TRPCResponse<T> = {
  result?: {
    data?: {
      json?: T;
    };
  };
};

export type CreateTicketTRPC = TRPCResponse<Ticket>[];

export type RowsPerPage = "10" | "25";
