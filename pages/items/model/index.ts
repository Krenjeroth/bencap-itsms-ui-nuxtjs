export { columns, items, classificationOptions };

const columns: ITableColumns[] = [
  {
    key: "parent_component",
    label: "Parent Component",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "property_number",
    label: "Property Number",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "ip_address",
    label: "IP Address",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "mac_address",
    label: "MAC Address",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_type.type",
    label: "Item Type",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_type.classification",
    label: "Classification",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_type.purpose",
    label: "Purpose",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "brand_model",
    label: "Brand Model",
    rowClass: "whitespace-pre-line max-w-fit",
  },

  // {
  //   key: "code",
  //   label: "Code",
  //   rowClass: "whitespace-pre-line max-w-fit",
  // },
  // {
  //   key: "barcode",
  //   label: "Barcode",
  //   rowClass: "whitespace-pre-line max-w-fit",
  // },
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
    },
  ],
  // [
  //   {
  //     label: "Archive",
  //     icon: "i-heroicons-archive-box-20-solid",
  //   },
  //   {
  //     label: "Move",
  //     icon: "i-heroicons-arrow-right-circle-20-solid",
  //   },
  // ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
    },
  ],
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
