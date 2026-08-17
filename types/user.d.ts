import type { z } from "zod";

declare global {
  interface IUser {
    id: string;
    username: string;
    email: string;
    profile: IUserProfile | null;
    permissions: Record<string, true>;
    roles: {
      id: number;
      title: string;
    }[];
    offices_assigned: unknown[];
    agencies_assigned: {
      id: number;
      abbreviation: string | null;
    }[];
    offices_assigned_ids: number[];
    agencies_assigned_ids: number[];
    offices_agencies_assigned: {
      id: number;
      abbreviation: string | null;
    }[];
  }

  type TCreateUserValidationSchema = z.output<
    typeof CreateUserValidationSchema
  >;
  type TUpdateUserValidationSchema = z.output<
    typeof UpdateUserValidationSchema
  >;
}

export { IUser, TCreateUserValidationSchema };
