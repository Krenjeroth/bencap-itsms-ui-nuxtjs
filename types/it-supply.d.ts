import type { z } from "zod";

declare global {
  interface IItSupply {
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
    ics_number?: string;
    iar_number?: string;
    po_number?: string;
  }

  type TItSupplySelectOption = {
    id: number | string;
    measurement_unit: string;
    brand_model: string;
    description: string | null;
    item_number: string | null;
    stock_number: string | null;
    quantity: number;
    ics_number?: string;
    iar_number?: string;
    po_number?: string;
  };

  type TCreateItSupplyValidationSchema = z.output<
    typeof CreateItSupplyValidationSchema
  >;
  type TUpdateItSupplyValidationSchema = z.output<
    typeof UpdateItSupplyValidationSchema
  >;
}

export {
  IItSupply,
  TItSupplySelectOption,
  TCreateItSupplyValidationSchema,
  TUpdateItSupplyValidationSchema,
};
