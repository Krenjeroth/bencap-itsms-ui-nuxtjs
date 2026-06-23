import { z } from "zod";

const statusEnum = z.enum([
  "pending",
  "in_progress",
  "completed",
  "on_hold",
  "cancelled",
]);

export const CreateOtherItServiceRequestValidationSchema = z.object({
  control_number: z.string().optional(),
  status: statusEnum.default("pending"),
  date_of_request: z.string().optional(),
  department_office: z.string().min(1, "Department/Office is required"),
  requestor_name: z.string().min(1, "Name of requestor is required"),

  service_printing: z.boolean().default(false),
  service_information_material: z.boolean().default(false),
  service_program_paper: z.boolean().default(false),
  service_brochure: z.boolean().default(false),
  service_iec_material: z.boolean().default(false),
  service_handbook: z.boolean().default(false),
  service_certificates: z.boolean().default(false),
  service_others: z.boolean().default(false),
  service_qty: z.number().min(1).optional(),
  service_laptop_tv_setup: z.boolean().default(false),
  service_others_specify: z.string().optional(),

  program_activity_details: z.string().optional(),
  activity_date_text: z.string().optional(),
  activity_time: z.string().optional(),
});

export const UpdateOtherItServiceRequestValidationSchema =
  CreateOtherItServiceRequestValidationSchema.extend({
    assigned_personnel: z.string().optional(),
    date_received: z.string().optional(),
    action_taken: z.string().optional(),
    feedback_rating: z.number().min(1).max(5).optional(),
    feedback_name: z.string().optional(),
    feedback_date: z.string().optional(),
  });

export type TCreateOtherItServiceRequestValidationSchema = z.infer<
  typeof CreateOtherItServiceRequestValidationSchema
>;
export type TUpdateOtherItServiceRequestValidationSchema = z.infer<
  typeof UpdateOtherItServiceRequestValidationSchema
>;
