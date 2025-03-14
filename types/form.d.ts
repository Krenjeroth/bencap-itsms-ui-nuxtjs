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

  interface ICreateMemberForm {
    prefix?: string | null;
    firstname?: string;
    middlename?: string;
    lastname?: string;
    suffix?: string | null;
    email?: string;
    phone?: string;
    gender?: string;
    date_of_birth?: TDatePickerDate;
    join_date?: TDatePickerDate;
    address?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    photo_id?: File | null;
  }

  type IFormSubmitEvent<T> = FormSubmitEvent<T>;
}

export { LoginForm, CreateUserForm, CreateMemberForm, IFormSubmitEvent };
