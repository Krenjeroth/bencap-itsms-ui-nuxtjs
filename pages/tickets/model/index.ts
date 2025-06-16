export { columns, items, classificationOptions };

const columns: ITableColumns[] = [
  {
    key: "ticket_number",
    label: "Ticket Number",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "employee.full_name",
    label: "Employee",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "concern",
    label: "Concern",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "query_status_formatted",
    label: "Query Status",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "request_status_formatted",
    label: "Request Status",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "priority_formatted",
    label: "Priority",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "date_formatted",
    label: "Request Date",
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
