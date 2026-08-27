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

  interface OnlineUser {
    id: number;
    email: string;
    username: string;
    display_name: string | null;
    designation: string | null;
    status: "online" | "offline" | "busy";
    status_text: string | null;
    last_seen_at: string | null;
    last_seen_at_humanized: string | null;
    roles: Array<{ id: number; title: string }>;
    departments: Array<{ id: number; name: string }>;
    img_path: string | null;
  }

  type TCreateUserValidationSchema = z.output<
    typeof CreateUserValidationSchema
  >;
  type TUpdateUserValidationSchema = z.output<
    typeof UpdateUserValidationSchema
  >;
}

export { IUser, TCreateUserValidationSchema };
