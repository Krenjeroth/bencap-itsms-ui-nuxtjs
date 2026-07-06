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
    office_id?: number | null;
    office_code?: string | null;
    office_name?: string | null;
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

  type TStoreInventoryPayload = {
    employee_id: number | null;
    office_id: number | null;
    office_code: string | null;
    office_name: string | null;
    item_type_id: number | null;
    brand_model_id: number | null;
    parent_component_id: number | null;

    ip_address: string | null;
    mac_address: string | null;
    remarks: string | null;

    operating_system_name: string | null;
    os_license_number: string | null;
    anti_virus_name: string | null;
    anti_virus_license_number: string | null;
    microsoft_office_name: string | null;
    ms_office_license_number: string | null;
    other_installed_applications: string | null;

    property_number: string;
    date_acquired: Date | string | null;
    warranty_expiration_date: Date | string | null;
    serial_number: string | null;
    status: string | null;

    internal_components: any[];
  };

  interface IAddComponentInventoryForm {
    item_type?: number;
    brand_model?: {
      id: number;
      name?: string | null;
      specification: string;
    };
    parent_property_number?: string;
    property_number?: string;
    date_acquired?: Date | string | null;
    serial_number?: string | null;
    status?: string | null;
    parent_id?: number;
    inventory?: number;
  }

  type TUpdateInventoryPayload = TStoreInventoryPayload;

  type TCreateInventoryValidationSchema = z.output<
    typeof CreateInventoryValidationSchema
  >;
  type TUpdateInventoryValidationSchema = z.output<
    typeof UpdateInventoryValidationSchema
  >;
  type TAddComponentValidationSchema = z.output<
    typeof AddComponentValidationSchema
  >;
}

export {
  IInventory,
  TInventorySelectOption,
  TCreateInventoryValidationSchema,
  TUpdateInventoryValidationSchema,
  TAddComponentValidationSchema,
};
