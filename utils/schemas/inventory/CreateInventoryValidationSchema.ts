import { z } from "zod";

const employeeSchema = z
  .object({
    id: z.number(),
    full_name: z.string(),
  })
  .nullable()
  .optional();

const officeSchema = z
  .object({
    id: z.number(),
    office_code: z.string().nullable().optional(),
    office_desc: z.string(),
    divisions: z.array(z.any()).optional(),
  })
  .nullable()
  .optional();

const divisionSchema = z
  .object({
    id: z.number(),
    division: z.string(),
  })
  .nullable()
  .optional();

const inventorySchema = z
  .object({
    id: z.number(),
    property_number: z.string(),
  })
  .nullable()
  .optional();

const brandModelSchema = z
  .object({
    id: z.number(),
    name: z.string().nullable().optional(),
    specification: z.string(),
  })
  .nullable()
  .optional();

const internalComponentSchema = z.object({
  brand_model: brandModelSchema,
  specific_serial_number: z.string().nullable().optional(),
  slot: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  notes: z.string().nullable().optional(),
});

export const createInventoryValidationSchema = (
  itemType?: TItemTypeSelectOption,
) => {
  const isMainInventory = !!itemType?.is_main_inventory;

  const isComponentType = !!itemType?.is_component;

  const supportsInternalComponents = !!itemType?.supports_internal_components;

  return z
    .object({
      item_type: z.number().int().positive(),

      employee: employeeSchema,

      office: officeSchema,

      division: divisionSchema,

      inventory: inventorySchema,

      brand_model: brandModelSchema,

      ip_address: z
        .string()
        .refine(
          (value) => {
            const ipv4 =
              /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

            const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|::1)$/;

            return ipv4.test(value) || ipv6.test(value);
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
          "Invalid MAC address format",
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

      warranty_expiration_date: z.date().nullable().optional(),

      serial_number: z.string().nullable().optional(),

      property_number: z.string().min(1, "Property number is required."),

      status: z.string().nullable().optional(),

      internal_components: z
        .array(internalComponentSchema)
        .nullable()
        .optional(),
    })
    .superRefine((data, ctx) => {
      const hasParent = !!data.inventory?.id;
      const hasEmployee = !!data.employee?.id;
      const hasBrandModel = !!data.brand_model?.id;

      const components = data.internal_components ?? [];

      const isStandaloneMainInventory =
        isMainInventory && (!isComponentType || !hasParent);

      const isChildComponent = isComponentType && hasParent;

      /*
       * A child component must have a parent and
       * its own brand model.
       */
      if (isChildComponent) {
        if (!hasBrandModel) {
          ctx.addIssue({
            path: ["brand_model"],
            code: z.ZodIssueCode.custom,
            message: "Brand model is required.",
          });
        }

        if (components.length > 0) {
          ctx.addIssue({
            path: ["internal_components"],
            code: z.ZodIssueCode.custom,
            message: "Child components cannot contain internal components.",
          });
        }

        return;
      }

      /*
       * Main inventories may be standalone.
       */
      if (isStandaloneMainInventory) {
        if (!hasEmployee) {
          ctx.addIssue({
            path: ["employee"],
            code: z.ZodIssueCode.custom,
            message: "Employee is required.",
          });
        }

        if (
          data.office?.divisions &&
          data.office.divisions.length > 0 &&
          !data.division?.id
        ) {
          ctx.addIssue({
            path: ["division"],
            code: z.ZodIssueCode.custom,
            message: "Division is required for this office.",
          });
        }

        if (supportsInternalComponents) {
          if (components.length === 0) {
            ctx.addIssue({
              path: ["internal_components"],
              code: z.ZodIssueCode.custom,
              message: "At least one internal component is required.",
            });
          }

          components.forEach((component, index) => {
            if (!component.brand_model?.id) {
              ctx.addIssue({
                path: ["internal_components", index, "brand_model"],
                code: z.ZodIssueCode.custom,
                message: "Model is required.",
              });
            }
          });
        } else if (components.length > 0) {
          ctx.addIssue({
            path: ["internal_components"],
            code: z.ZodIssueCode.custom,
            message: "This item type cannot contain internal components.",
          });
        }

        return;
      }

      /*
       * Component-only item types must have a parent.
       */
      if (isComponentType && !hasParent) {
        ctx.addIssue({
          path: ["inventory"],
          code: z.ZodIssueCode.custom,
          message: "Parent Component is required.",
        });

        if (!hasBrandModel) {
          ctx.addIssue({
            path: ["brand_model"],
            code: z.ZodIssueCode.custom,
            message: "Brand model is required.",
          });
        }
      }

      /*
       * Reject item types that are neither main
       * inventories nor components.
       */
      if (!isMainInventory && !isComponentType) {
        ctx.addIssue({
          path: ["item_type"],
          code: z.ZodIssueCode.custom,
          message: "The selected item type has no valid inventory mode.",
        });
      }
    });
};

export const CreateInventoryValidationSchema = createInventoryValidationSchema;
