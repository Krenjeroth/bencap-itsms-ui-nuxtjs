import { z } from "zod";

export const UpdateInventoryValidationSchema = z
  .object({
    item_type: z.number(),
    employee: z
      .object({
        id: z.number(),
        fullname: z.string(),
      })
      .nullable()
      .optional(),
    inventory: z
      .object({
        id: z.number(),
        property_number: z.string(),
      })
      .nullable()
      .optional(),
    brand_model: z
      .object({
        id: z.number(),
        name: z.string().nullable().optional(),
        specification: z.string(),
        // specifications_json: z.string().nullable().optional(),
        // brand: z
        //   .object({
        //     id: z.number(),
        //     name: z.string(),
        //     status: z.string().nullable().optional(),
        //   })
        //   .optional(),
        // item_type: z
        //   .object({
        //     id: z.number(),
        //     type: z.string(),
        //     classification: z.string(),
        //     purpose: z.string(),
        //     is_main_inventory: z.boolean(),
        //     is_component: z.boolean(),
        //     status: z.string().nullable().optional(),
        //   })
        //   .optional(),
        // image: z.string().nullable().optional(),
        // year_released: z.string().nullable().optional(),
        // status: z.string().optional(),
      })
      .nullable()
      .optional(),
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
        },
      )
      .nullable()
      .optional(),
    mac_address: z
      .string()
      .regex(
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        "Invalid MAC address format (expected XX:XX:XX:XX:XX:XX / XX-XX-XX-XX-XX-XX)",
      )
      .nullable()
      .optional(),
    remarks: z.string().nullable().optional(),
    operating_system_name: z.string().nullable().optional(),
    os_license_number: z.string().nullable().optional(),
    anti_virus_name: z.string().nullable().optional(),
    anti_virus_license_number: z.string().nullable().optional(),
    microsoft_office_name: z.string().nullable().optional(),
    ms_office_license_number: z.string().nullable().optional(),
    other_installed_applications: z.string().nullable().optional(),
    date_acquired: z.date().nullable().optional(),
    serial_number: z.string().nullable().optional(),

    property_number: z.string(),

    warranty_expiration_date: z.date().nullable().optional(),
    status: z.string().nullable().optional(),
    // internal_components: z
    //   .array(
    //     z
    //       .object({
    //         brand_model: z
    //           .object({
    //             id: z.number(),
    //             name: z.string(),
    //             brand: z.object({
    //               id: z.number(),
    //               name: z.string(),
    //             }),
    //             item_type: z.object({
    //               id: z.number(),
    //               type: z.string(),
    //               classification: z.string(),
    //               purpose: z.string(),
    //               status: z.string().nullable().optional(),
    //             }),
    //             image: z.string().nullable().optional(),
    //             year_released: z.string().nullable().optional(),
    //             status: z.string().optional(),
    //           })
    //           .optional(),
    //         specific_serial_number: z.string().nullable().optional(),
    //         quantity: z.number().optional(),
    //       })
    //       .optional()
    //   )
    //   .optional()
    //   .nullable(),
    // Use the new InternalComponentSchema for the array.
    internal_components: z
      .array(
        z.object({
          brand_model: z
            .object({
              id: z.number(),
              name: z.string().nullable().optional(),
              // brand: z.object({
              //   id: z.number(),
              //   name: z.string(),
              // }),
              // item_type: z.object({
              //   id: z.number(),
              //   type: z.string(),
              //   classification: z.string(),
              //   purpose: z.string(),
              //   is_main_inventory: z.boolean(),
              //   is_component: z.boolean(),
              //   status: z.string().nullable().optional(),
              // }),
              // image: z.string().nullable().optional(),
              // year_released: z.string().nullable().optional(),
              // status: z.string().optional(),
              specification: z.string(),
              // specifications_json: z.string().optional(),
              // part_number: z.string().optional(),
            })
            .optional(),
          // specific_serial_number: z.string().nullable().optional(),
          quantity: z.number().optional(),
        }),
      )
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Corrected: Now checking data.item_type directly as a number
    if (data.item_type === 1) {
      if (!data.employee || data.employee.id === null) {
        ctx.addIssue({
          path: ["employee"],
          code: z.ZodIssueCode.custom,
          message: "Employee is required.",
        });
      }

      // Rule 1: The `internal_components` array must exist and not be empty.
      if (!data.internal_components || data.internal_components.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one internal component is required for this item type.",
          path: ["internal_components"],
        });
      } else {
        // Rule 2: Each item in the array must have a `brand_model` selected.
        data.internal_components.forEach((component, index) => {
          if (!component.brand_model) {
            console.log(component, component.brand_model, index);
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Model is required. - " + index,
              path: ["internal_components", index, "brand_model"],
            });
          }
        });
      }
    } else {
      if (!data.inventory || data.inventory.id === null) {
        ctx.addIssue({
          path: ["inventory"],
          code: z.ZodIssueCode.custom,
          message: "Parent Component is required.",
        });
      }

      if (!data.brand_model || data.brand_model.id === null) {
        ctx.addIssue({
          path: ["brand_model"],
          code: z.ZodIssueCode.custom,
          message: "Brand model is required.",
        });
      }

      // if (!data.serial_number || data.serial_number.trim() === "") {
      //   ctx.addIssue({
      //     path: ["serial_number"],
      //     code: z.ZodIssueCode.custom,
      //     message: "Serial number is required.",
      //   });
      // }
    }
  });
