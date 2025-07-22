import type { z } from "zod";

declare global {
  interface IInventoryItem {
    id: number;
    brand_model: {
      id: number;
      name: string;
      item_type: {
        id: number;
        type: string;
        classification: string;
        purpose: string;
        status: string;
      };
      brand: {
        id: number;
        name: string;
        status: string;
      };
      image?: string | null;
      year_released?: string | null;
      status: string;
    };
    measurement_unit: {
      id: number;
      name: string;
      abbreviation: string;
      description?: string | null;
    };
    description?: string | null;
    description_formatted?: string;
    item_number?: string;
    quantity?: number;
    stock_number: string;
  }

  type TInventoryItemSelectOption = {
    id: number | string;
    measurement_unit: string;
    brand_model: string;
    description: string | null;
    item_number: string | null;
    stock_number: string | null;
    quantity: number;
  };

  type TCreateInventoryItemValidationSchema = z.output<
    typeof CreateInventoryItemValidationSchema
  >;
  type TUpdateInventoryItemValidationSchema = z.output<
    typeof UpdateInventoryItemValidationSchema
  >;
}

export {
  IInventoryItem,
  TInventoryItemSelectOption,
  TCreateInventoryItemValidationSchema,
  TUpdateInventoryItemValidationSchema,
};
