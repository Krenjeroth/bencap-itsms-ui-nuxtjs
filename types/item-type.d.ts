import type { z } from "zod";

declare global {
  interface IItemType {
    id: string;
    type: string;
    classification: string;
    purpose: string;
    is_main_inventory: boolean;
    is_component: boolean;
  }

  type TItemTypeSelectOption = {
    id: number | string;
    type: string;
  };

  type TCreateItemTypeValidationSchema = z.output<
    typeof CreateItemTypeValidationSchema
  >;
  type TUpdateItemTypeValidationSchema = z.output<
    typeof UpdateItemTypeValidationSchema
  >;
}

export {
  IItemType,
  TItemTypeSelectOption,
  TCreateItemTypeValidationSchema,
  TUpdateItemTypeValidationSchema,
};
