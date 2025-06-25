import type { z } from "zod";

declare global {
  interface ITicket {
    id: string;
    profile_id: string;
    employee_id: string;
    item_id: string;
    it_service_id: string;
    ticket_number: string;
    concern: string;
    query_status: string;
    request_status: string;
    priority: string;
    date: string;
    barcode: string;
    description: string | null;
    serial_number: string | null;
    property_number: string;
    ics_number: string | null;
    date_acquired: string;
    ip_address: string | null;
    mac_address: string | null;
    status: string;
    inventory_type: string;
  }

  type TCreateTicketValidationSchema = z.output<
    typeof CreateTicketValidationSchema
  >;
  type TUpdateTicketValidationSchema = z.output<
    typeof UpdateTicketValidationSchema
  >;
  type TResolveTicketValidationSchema = z.output<
    typeof ResolveTicketValidationSchema
  >;
  type TSetTicketServiceMethodValidationSchema = z.output<
    typeof SetTicketServiceMethodValidationSchema
  >;
}

export {
  ITicket,
  TCreateTicketValidationSchema,
  TUpdateTicketValidationSchema,
  TResolveTicketValidationSchema,
  TSetTicketServiceMethodValidationSchema,
};
