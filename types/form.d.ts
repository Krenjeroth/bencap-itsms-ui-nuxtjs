import type { FormSubmitEvent } from "#ui/types";

declare global {
  interface ILoginForm {
    email?: string;
    password?: string;
  }

  interface ICreateUserForm {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }

  interface IUpdateUserForm {
    name?: string;
    email?: string;
    role_id?: number;
    role?: number | string;
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
    // item_type?: number;
    brand?: number;
    image?: string;
    year_released?: string;
  }

  interface IUpdateBrandModelForm {
    name?: string;
    // item_type?: number;
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
    brand_model?: {
      id?: number;
      name?: string;
      brand?: {
        id?: number;
        name?: string;
      };
      image?: string | null;
      year_released?: string | null;
      status?: string;
    };
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
  }

  interface IUpdateItemForm {
    brand_model?: {
      id?: number;
      name?: string;
      brand?: {
        id?: number;
        name?: string;
      };
      image?: string | null;
      year_released?: string | null;
      status?: string;
    };
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
  }

  interface ICreateSolutionForm {
    description?: string;
    author_id?: number;
    item_type_id?: number;
  }

  interface IUpdateSolutionForm {
    description?: string;
  }

  interface IResolveTicketForm {
    solution?: number | null;
  }

  interface ISetTicketServiceMethodForm {
    service_method?: string | null;
  }

  interface ISetTicketReleaseDateForm {
    released_at?: TDatePickerDate | null;
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
  IFormSubmitEvent,
};
