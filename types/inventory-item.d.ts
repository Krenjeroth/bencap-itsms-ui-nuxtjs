import type { z } from "zod";

declare global {
  interface IInventoryItem {
    id: string;
    measurement_unit: string;
    brand_model: string;
    description: string | null;
    item_number: string | null;
    stock_number: string | null;
    quantity: number;
  }

  // type TInventoryItemSelectOption = {
  //   id: number | string;
  //   measurement_unit: string;
  //   brand_model: string;
  //   description: string | null;
  //   item_number: string | null;
  //   stock_number: string | null;
  //   quantity: number;
  // };

  type TCreateInventoryItemValidationSchema = z.output<
    typeof CreateInventoryItemValidationSchema
  >;
  type TUpdateInventoryItemValidationSchema = z.output<
    typeof UpdateInventoryItemValidationSchema
  >;
}

export {
  IInventoryItem,
  // TInventoryItemSelectOption,
  TCreateInventoryItemValidationSchema,
  TUpdateInventoryItemValidationSchema,
};
