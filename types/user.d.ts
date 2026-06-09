import type { z } from "zod";

declare global {
  interface IUser {
    id: string;
    username: string;
    email: string;
    profile: any;
    permissions: Record<string, true>;
    roles: { id: number; title: string }[];
  }

  type TCreateUserValidationSchema = z.output<
    typeof CreateUserValidationSchema
  >;
  type TUpdateUserValidationSchema = z.output<
    typeof UpdateUserValidationSchema
  >;
}

export { IUser, TCreateUserValidationSchema };
