import type { z } from "zod";

declare global {
  interface IInventory {
    id: string;
    // item_type: string;
    employee: string;
    inventory_item: string;
    // brand_model: string;
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

  type TInventorySelectOption = {
    id: number | string;
    // item_type: string;
    employee: string;
    inventory_item: string;
    // brand_model: string;
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

  type TCreateInventoryValidationSchema = z.output<
    typeof CreateInventoryValidationSchema
  >;
  type TUpdateInventoryValidationSchema = z.output<
    typeof UpdateInventoryValidationSchema
  >;
}

export {
  IInventory,
  TInventorySelectOption,
  TCreateInventoryValidationSchema,
  TUpdateInventoryValidationSchema,
};
