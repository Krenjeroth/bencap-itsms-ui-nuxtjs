import { z } from "zod";

export const CreateItemValidationSchema = z.object({
  brand_model: z.object({
    id: z.number(),
    name: z.string(),
    brand: z.object({
      id: z.number(),
      name: z.string(),
      status: z.string(),
    }),
    image: z.string().nullable().optional(),
    year_released: z.string().nullable().optional(),
    status: z.string(),
  }),
  parent_component: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  serial_number: z.string().nullable().optional(),
  property_number: z.string(),
  ics_number: z.string().nullable().optional(),
  date_acquired: z.date().nullable().optional(),
  ip_address: z
    .string()
    .refine(
      (val) => {
        const ipv4 =
          /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
        const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|::1)$/;
        return ipv4.test(val) || ipv6.test(val);
      },
      {
        message: "Invalid IP address (must be IPv4 or IPv6)",
      }
    )
    .nullable()
    .optional(),
  mac_address: z
    .string()
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC address format (expected XX:XX:XX:XX:XX:XX)"
    )
    .nullable()
    .optional(),
  inventory_type: z.string().nullable().optional(),
});
