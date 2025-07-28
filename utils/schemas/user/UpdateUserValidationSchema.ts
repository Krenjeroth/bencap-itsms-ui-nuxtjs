import { z } from "zod";
const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
const fileSizeLimit = 2 * 1024 * 1024; // 2MB

export const UpdateUserValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Email is required",
    })
    .email("Email is not valid"),
  role: z.union([z.number(), z.string()]),
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
});

export const updatePhotoIdSchema = z
  .custom<File | undefined | null>()
  .refine((file) => !file || acceptedFileTypes.includes(file?.type)!, {
    message: "Photo ID must be a PNG, JPEG, or JPG",
  })
  .refine((file) => !file || file?.size <= fileSizeLimit!, {
    message: "Photo ID must be less than 2MB",
  });
