import type { z } from "zod";

declare global {
  interface IItem {
    id: string;
    // item_type: string;
    employee: string;
    brand_model: string;
    parent_component: string | null;
    code: string | null;
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

  type TItemSelectOption = {
    id: number | string;
    // item_type: string;
    employee: string;
    brand_model: string;
    parent_component: string | null;
    code: string | null;
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
  };

  type TCreateItemValidationSchema = z.output<
    typeof CreateItemValidationSchema
  >;
  type TUpdateItemValidationSchema = z.output<
    typeof UpdateItemValidationSchema
  >;
}

export {
  IItem,
  TItemSelectOption,
  TCreateItemValidationSchema,
  TUpdateItemValidationSchema,
};
