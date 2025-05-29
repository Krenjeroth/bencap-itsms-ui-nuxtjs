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

  type IFormSubmitEvent<T> = FormSubmitEvent<T>;
}

export {
  LoginForm,
  CreateUserForm,
  ICreateDepartmentForm,
  IUpdateDepartmentForm,
  ICreatePermissionForm,
  IUpdatePermissionForm,
  ICreateRoleForm,
  IUpdateRoleForm,
  IFormSubmitEvent,
};
