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
  }

  interface IUpdateUserForm {
    name?: string;
    email?: string;
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

  type IFormSubmitEvent<T> = FormSubmitEvent<T>;
}

export {
  LoginForm,
  CreateUserForm,
  ICreateDepartmentForm,
  IUpdateDepartmentForm,
  ICreatePermissionForm,
  IUpdatePermissionForm,
  IFormSubmitEvent,
};
