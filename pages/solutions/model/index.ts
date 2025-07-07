// const authStore = useAuthStore();
const { hasRole } = useRoleHandler();

export { columns, items, classificationOptions, expandableDetails };

const columns: ITableColumns[] = [
  {
    key: "title",
    label: "Title",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "description",
    label: "Description",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "error_code",
    label: "Error Code",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "actions",
    rowClass: "whitespace-pre-line max-w-fit text-center",
  },
];

const items: ITableActions = (row: any, handlers: IHandlers) => {
  const actions: any[] = [];
  const isAdmin = hasRole("admin");
  const isPersonnel = hasRole("personnel");

  if (isAdmin || isPersonnel) {
    actions.push([
      {
        label: "Edit",
        icon: "i-heroicons-pencil-square-20-solid",
        click: () => handlers.edit?.(row),
      },
    ]);

    actions.push([
      {
        label: "Delete",
        icon: "i-heroicons-trash-20-solid",
        click: () => handlers.delete?.(row),
      },
    ]);
  }

  return actions;
};

const expandableDetails: ITableExpandableDetails = (row: any) => [
  {
    key: "author.display_name",
    label: "Author",
    value: row.author.display_name,
  },
  {
    key: "reference_url",
    label: "Reference URL",
    value: row.reference_url,
  },
  {
    key: "description_updated_at_formatted",
    label: "Description Updated At",
    value: row.description_updated_at_formatted,
  },
];

const classificationOptions: ITableStatusOptions[] = [
  { key: "all", label: "All", value: "" },
  { key: "software", label: "Software", value: "SOFTWARE" },
  { key: "hardware", label: "Hardware", value: "HARDWARE" },
  { key: "accessory", label: "Accessory", value: "ACCESSORY" },
  { key: "consumable", label: "Consumable", value: "CONSUMABLE" },
  { key: "equipment", label: "Equipment", value: "EQUIPMENT" },
  { key: "office_supply", label: "Office Supply", value: "OFFICE SUPPLY" },
  { key: "system_unit", label: "System Unit", value: "SYSTEM UNIT" },
  { key: "tool", label: "Tool", value: "TOOL" },
];
