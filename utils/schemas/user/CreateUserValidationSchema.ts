import { z } from "zod";
const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
const fileSizeLimit = 2 * 1024 * 1024; // 2MB

export const CreateUserValidationSchema = z
  .object({
    // name: z
    //   .string({
    //     invalid_type_error: "Name is required",
    //   })
    //   .min(3, "Name must be at least 3 characters long"),
    email: z
      .string({
        invalid_type_error: "Email is required",
      })
      .email("Email is not valid"),
    password: z
      .string({
        invalid_type_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long"),
    role: z.union([z.number(), z.string()]),

    offices_assigned_ids: z.array(z.coerce.number()).optional(),

    agencies_assigned_ids: z.array(z.coerce.number()).optional().default([]),

    // Profile
    prefix: z
      .string()
      .regex(/^[A-Za-z]+$/, "Prefix must be alphabets only.")
      .nullable()
      .optional(),
    firstname: z
      .string({
        required_error: "First name is required",
      })
      .min(3, "First name must be at least 3 characters long")
      .max(50, "First name must be at most 50 characters long"),
    middlename: z
      .string({
        required_error: "Middle name is required",
      })
      .min(3, "Middle name must be at least 3 characters long")
      .max(50, "Middle name must be at most 50 characters long"),
    lastname: z
      .string({
        required_error: "Last name is required",
      })
      .min(3, "Last name must be at least 3 characters long")
      .max(50, "Last name must be at most 50 characters long"),
    suffix: z
      .string()
      .regex(/^[A-Za-z]+$/, "Suffix must be alphabets only.")
      .nullable()
      .optional(),
    designation: z
      .string({
        required_error: "Designation is required",
      })
      .min(3, "Designation must be at least 3 characters long")
      .max(50, "Designation must be at most 50 characters long"),
    gender: z.enum(["male", "female"]),
    photo_id: z
      .custom<File | undefined | null>()
      .refine((file) => !file || acceptedFileTypes.includes(file?.type)!, {
        message: "Photo ID must be a PNG, JPEG, or JPG",
      })
      .refine((file) => !file || file?.size <= fileSizeLimit!, {
        message: "Photo ID must be less than 2MB",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.role === 2) {
      // if (
      //   !data.offices_assigned_ids ||
      //   data.offices_assigned_ids.length === 0
      // ) {
      //   ctx.addIssue({
      //     path: ["offices_assigned_ids"],
      //     code: z.ZodIssueCode.custom,
      //     message: "Offices assigned is required.",
      //   });
      // }
      // if (
      //   !data.agencies_assigned_ids ||
      //   data.agencies_assigned_ids.length === 0
      // ) {
      //   ctx.addIssue({
      //     path: ["agencies_assigned_ids"],
      //     code: z.ZodIssueCode.custom,
      //     message: "Agencies assigned is required.",
      //   });
      // }
    }
  });

export const CreatePhotoIdSchema = z
  .custom<File | undefined | null>()
  .refine((file) => !file || acceptedFileTypes.includes(file?.type)!, {
    message: "Photo ID must be a PNG, JPEG, or JPG",
  })
  .refine((file) => !file || file?.size <= fileSizeLimit!, {
    message: "Photo ID must be less than 2MB",
  });
