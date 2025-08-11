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
    name?: string | null;
    specification?: string;
    item_type?: number;
    brand?: number;
    image?: string;
    year_released?: string | null;
  }

  interface IUpdateBrandModelForm {
    name?: string | null;
    specification?: string;
    item_type?: number;
    brand?: number;
    image?: string;
    year_released?: string | null;
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

  interface ICreateInventoryForm {
    item_type?: number;
    employee?: {
      id: number;
      full_name: string;
    } | null;
    inventory?: {
      id: number;
      property_number: string;
    } | null;
    brand_model?: {
      id?: number;
      name?: string | null;
      specification?: string;
    } | null;
    ip_address?: string | null;
    mac_address?: string | null;
    remarks?: string | null;
    operating_system_name?: string | null;
    os_license_number?: string | null;
    anti_virus_name?: string | null;
    anti_virus_license_number?: string | null;
    microsoft_office_name?: string | null;
    ms_office_license_number?: string | null;
    other_installed_applications?: string | null;

    // parent_component?: number | null;
    date_acquired?: TDatePickerDate;
    serial_number?: string | null;
    property_number?: string;
    warranty_expiration_date?: TDatePickerDate;
    status?: string | null;
    internal_components?: Array | null;
  }

  interface IUpdateInventoryForm {
    item_type?: number;
    employee?: {
      id: number;
      full_name: string;
    } | null;
    inventory?: {
      id: number;
      property_number: string;
    } | null;
    brand_model?: {
      id?: number;
      name?: string | null;
      specification?: string;
    } | null;
    ip_address?: string | null;
    mac_address?: string | null;
    remarks?: string | null;
    operating_system_name?: string | null;
    os_license_number?: string | null;
    anti_virus_name?: string | null;
    anti_virus_license_number?: string | null;
    microsoft_office_name?: string | null;
    ms_office_license_number?: string | null;
    other_installed_applications?: string | null;

    // parent_component?: number | null;
    date_acquired?: TDatePickerDate;
    serial_number?: string | null;
    property_number?: string;
    warranty_expiration_date?: TDatePickerDate;
    status?: string | null;
    internal_components?: Array | null;
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
    inventory?: Inventory | null;
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
    inventory?: Inventory | null;
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

  interface ICreateItSupplyForm {
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
        status?: string | null;
      };
      image?: string | null;
      year_released?: string | null;
      status?: string | null;
    };
    description?: string | null;
    item_number?: string | null;
    stock_number?: string | null;
    ics_number?: string | null;
    iar_number?: string | null;
    po_number?: string | null;
    quantity?: number;
  }

  interface IUpdateItSupplyForm {
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
        status?: string | null;
      };
      image?: string | null;
      year_released?: string | null;
      status?: string | null;
    };
    description?: string | null;
    item_number?: string | null;
    stock_number?: string | null;
    ics_number?: string | null;
    iar_number?: string | null;
    po_number?: string | null;
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
  ICreateInventoryForm,
  IUpdateInventoryForm,
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
  ICreateItSupplyForm,
  IUpdateItSupplyForm,
  IFormSubmitEvent,
};
