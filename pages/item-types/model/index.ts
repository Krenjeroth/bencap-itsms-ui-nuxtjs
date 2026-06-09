export { columns, items, classificationOptions };

const { can } = useCan();

const columns: ITableColumns[] = [
  {
    key: "type",
    label: "Type",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "classification",
    label: "Classification",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "purpose",
    label: "Purpose",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "main_component",
    // label: "Main Inventory",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "actions",
    rowClass: "whitespace-pre-line max-w-fit text-center",
  },
];

const items: ITableActions = (row: any, handlers: IHandlers) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handlers.edit?.(row),
      hidden: !can("item_types.update"),
    },
  ].filter((i) => !i.hidden),
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
      hidden: !can("item_types.delete"),
    },
  ].filter((i) => !i.hidden),
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
