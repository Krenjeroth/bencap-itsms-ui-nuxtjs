import type { FormSubmitEvent } from "#ui/types";

declare global {
  interface ILoginForm {
    email?: string;
    password?: string;
  }

  interface ICreateUserForm {
    prefix?: string | null;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffix?: string | null;
    gender?: string;
    designation?: string;
    email?: string;
    password?: string;
    role?: string;
    photo_id?: File | null;
  }

  interface IUpdateUserForm {
    prefix?: string | null;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffix?: string | null;
    gender?: string;
    designation?: string;
    email?: string;
    role_id?: number;
    role?: number | string;
    img_path?: string | null;
    photo_id?: File | null;
  }

  interface ICreateDepartmentForm {
    name?: string;
    full_name?: string;
    division?: string;
    abbreviation?: string;
  }

  interface IUpdateDepartmentForm {
    name?: string;
    full_name?: string;
    division?: string;
    abbreviation?: string;
  }

  interface ICreatePositionForm {
    name?: string;
    abbreviation?: string;
    salary_grade?: string;
  }

  interface IUpdatePositionForm {
    name?: string;
    abbreviation?: string;
    salary_grade?: string;
  }

  interface ICreatePermissionForm {
    title?: string;
  }

  interface IUpdatePermissionForm {
    title?: string;
  }

  interface ICreateRoleForm {
    title?: string;
  }

  interface IUpdateRoleForm {
    title?: string;
    permission_ids?: number[];
  }

  interface ICreateEmployeeForm {
    uid?: string | null;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffix?: string | null;
    position?: number;
    department?: number;
  }

  interface IUpdateEmployeeForm {
    uid?: string | null;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffix?: string | null;
    position_id?: number | string;
    position?: number | string;
    department_id?: number;
    department?: number | string;
  }

  interface ICreateBrandForm {
    name?: string;
  }

  interface IUpdateBrandForm {
    name?: string;
  }

  interface ICreateBrandModelForm {
    name?: string;
    specification?: string | null;
    item_type?: number;
    brand?: number;
    image?: string;
    year_released?: string;
  }

  interface IUpdateBrandModelForm {
    name?: string;
    specification?: string | null;
    item_type?: number;
    brand?: number;
    image?: string;
    year_released?: string;
  }

  interface ICreateItemTypeForm {
    type?: string;
    classification?: string;
    purpose?: string;
  }

  interface IUpdateItemTypeForm {
    type?: string;
    classification?: string;
    purpose?: string;
  }

  interface ICreateCommonProblemForm {
    code?: string;
    general_term?: string;
    information?: string;
    item_type?: number;
  }

  interface IUpdateCommonProblemForm {
    code?: string;
    general_term?: string;
    information?: string;
    item_type?: number;
  }

  interface ICreateItemForm {
    employee?: {
      id: number;
      full_name: string;
    };
    inventory_item?: {
      id: number;
      brand_model?: {
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
      description?: string | null;
      description_formatted?: string;
      item_number: string;
      measurement_unit?: {
        id: number;
        name: string;
        abbreviation: string;
        description?: string | null;
      };
      quantity: number;
      stock_number: string;
    };
    // brand_model?: {
    //   id?: number;
    //   name?: string;
    //   brand?: {
    //     id?: number;
    //     name?: string;
    //   };
    //   item_type?: {
    //     id?: number;
    //     type?: string;
    //     classification?: string;
    //     purpose?: string;
    //     status?: string;
    //   };
    //   image?: string | null;
    //   year_released?: string | null;
    //   status?: string;
    // };
    parent_component?: string | null;
    code?: string | null;
    barcode?: string | null;
    description?: string | null;
    serial_number?: string | null;
    property_number?: string;
    ics_number?: string | null;
    date_acquired?: TDatePickerDate;
    ip_address?: string | null;
    mac_address?: string | null;
    inventory_type?: string | null;
    iar_number?: string | null;
    po_number?: string | null;
    control_number?: string | null;
    date_issued?: TDatePickerDate;
    date_accepted?: TDatePickerDate;
    date_installed?: TDatePickerDate;
  }

  interface IUpdateItemForm {
    employee?: {
      id: number;
      full_name: string;
    };
    inventory_item?: {
      id: number;
      brand_model?: {
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
      description?: string | null;
      description_formatted?: string;
      item_number: string;
      measurement_unit?: {
        id: number;
        name: string;
        abbreviation: string;
        description?: string | null;
      };
      quantity: number;
      stock_number: string;
    };
    // brand_model?: {
    //   id?: number;
    //   name?: string;
    //   brand?: {
    //     id?: number;
    //     name?: string;
    //   };
    //   item_type?: {
    //     id?: number;
    //     type?: string;
    //     classification?: string;
    //     purpose?: string;
    //     status?: string;
    //   };
    //   image?: string | null;
    //   year_released?: string | null;
    //   status?: string;
    // };
    parent_component?: string | null;
    code?: string | null;
    barcode?: string | null;
    description?: string | null;
    serial_number?: string | null;
    property_number?: string;
    ics_number?: string | null;
    date_acquired?: TDatePickerDate;
    ip_address?: string | null;
    mac_address?: string | null;
    inventory_type?: string | null;
    iar_number?: string | null;
    po_number?: string | null;
    control_number?: string | null;
    date_issued?: TDatePickerDate;
    date_accepted?: TDatePickerDate;
    date_installed?: TDatePickerDate;
  }

  interface ICreateItServiceForm {
    name?: string;
    description?: string;
    code?: string;
  }

  interface IUpdateItServiceForm {
    name?: string;
    description?: string;
    code?: string;
  }

  interface ICreateTicketForm {
    profile_id?: number;
    employee?: {
      id: number;
      full_name: string;
    };
    item?: Item | null;
    item_type?: number;
    it_service?: string;
    ticket_number?: string;
    concern?: string;
    query_status?: string;
    request_status?: string;
    priority?: string;
    date?: TDatePickerDate;
    contact_number?: string | null;
    is_other_agency?: boolean;
    full_name?: string | null;
    // agency?: {
    //   id?: number;
    //   name?: string;
    // } | null;
    agency?: Agency | null;
    agency_id?: number | null;
  }

  interface IUpdateTicketForm {
    // profile_id?: number;
    employee?: {
      id: number;
      full_name: string;
    };
    item?: Item | null;
    item_type?: number;
    it_service?: string | number;
    // ticket_number?: string;
    concern?: string;
    // query_status?: string;
    // request_status?: string;
    priority?: string;
    // date?: TDatePickerDate;
    contact_number?: string | null;
    is_other_agency?: boolean;
    full_name?: string | null;
    agency?: Agency | null;
    agency_id?: number | null;
  }

  interface ICreateSolutionForm {
    title?: string;
    description?: string | null;
    error_code?: string | null;
    reference_url?: string | null;
    author_id?: number;
  }

  interface IUpdateSolutionForm {
    title?: string;
    description?: string | null;
    error_code?: string | null;
    reference_url?: string | null;
    description_original_state?: string | null;
  }

  interface IResolveTicketForm {
    solution?: { id: number };
  }

  interface ISetTicketServiceMethodForm {
    service_method?: string | null;
  }

  interface ISetTicketReleaseDateForm {
    released_at?: TDatePickerDate | null;
  }

  interface ICreateAgencyForm {
    name?: string;
    abbreviation?: string;
  }

  interface IUpdateAgencyForm {
    name?: string;
    abbreviation?: string;
  }

  interface ICreateMeasurementUnitForm {
    name?: string;
    abbreviation?: string;
    description?: string | null;
  }

  interface IUpdateMeasurementUnitForm {
    name?: string;
    abbreviation?: string;
    description?: string | null;
  }

  interface ICreateInventoryItemForm {
    // measurement_unit?: {
    //   id: number;
    //   name: string;
    //   abbreviation: string;
    // };
    measurement_unit?: string | number;
    brand_model?: {
      id?: number;
      name?: string;
      specification?: string | null;
      brand?: {
        id?: number;
        name?: string;
      };
      item_type?: {
        id?: number;
        type?: string;
        classification?: string;
        purpose?: string;
        status?: string;
      };
      image?: string | null;
      year_released?: string | null;
      status?: string;
    };
    description?: string | null;
    item_number?: string | null;
    stock_number?: string | null;
    quantity?: number;
  }

  interface IUpdateInventoryItemForm {
    measurement_unit?: string | number;
    brand_model?: {
      id?: number;
      name?: string;
      specification?: string | null;
      brand?: {
        id?: number;
        name?: string;
      };
      item_type?: {
        id?: number;
        type?: string;
        classification?: string;
        purpose?: string;
        status?: string;
      };
      image?: string | null;
      year_released?: string | null;
      status?: string;
    };
    description?: string | null;
    item_number?: string | null;
    stock_number?: string | null;
    quantity?: number;
  }

  type IFormSubmitEvent<T> = FormSubmitEvent<T>;
}

export {
  LoginForm,
  CreateUserForm,
  ICreateDepartmentForm,
  IUpdateDepartmentForm,
  ICreatePositionForm,
  IUpdatePositionForm,
  ICreatePermissionForm,
  IUpdatePermissionForm,
  ICreateRoleForm,
  IUpdateRoleForm,
  ICreateEmployeeForm,
  IUpdateEmployeeForm,
  ICreateBrandForm,
  IUpdateBrandForm,
  ICreateBrandModelForm,
  IUpdateBrandModelForm,
  ICreateItemTypeForm,
  IUpdateItemTypeForm,
  ICreateCommonProblemForm,
  IUpdateCommonProblemForm,
  ICreateTicketForm,
  IUpdateTicketForm,
  ICreateSolutionForm,
  IUpdateSolutionForm,
  IResolveTicketForm,
  ISetTicketServiceMethodForm,
  ISetTicketReleaseDateForm,
  ICreateAgencyForm,
  IUpdateAgencyForm,
  ICreateMeasurementUnitForm,
  IUpdateMeasurementUnitForm,
  ICreateInventoryItemForm,
  IUpdateInventoryItemForm,
  IFormSubmitEvent,
};
