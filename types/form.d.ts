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
    position_id?: number;
    position?: number | string;
    department_id?: number;
    department?: number | string;
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
  IFormSubmitEvent,
};
