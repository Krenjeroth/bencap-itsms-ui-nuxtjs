// const authStore = useAuthStore();
import { useAuthStore } from "@/stores/auths";
export { columns, items, classificationOptions, expandableDetails };

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
    rowClass: "max-w-fit",
  },
  {
    key: "request_status_formatted",
    label: "Request Status",
    rowClass: "max-w-fit",
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
    key: "personnel",
    label: "Personnel In Charge",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "actions",
    rowClass: "whitespace-pre-line max-w-fit text-center",
  },
];

const items: ITableActions = (row: any, handlers: IHandlers) => {
  const actions: any[] = [];

  if (row.can_accept) {
    actions.push([
      {
        label: "Accept",
        icon: "material-symbols:assignment-add-outline",
        click: () => handlers.accept?.(row),
      },
    ]);
  }

  if (row.is_accepted_by_me) {
    actions.push([
      {
        label: "Check Stock",
        icon: "material-symbols:checked-bag-question-outline",
        click: () => handlers.checkStock?.(row),
      },
      {
        label: "Await Stock",
        icon: "material-symbols:deployed-code-history-outline",
        click: () => handlers.awaitStock?.(row),
      },
      {
        label: "Resolve",
        icon: "material-symbols:check-circle-outline",
        click: () => handlers.resolve?.(row),
      },
      {
        label: "Cancel",
        icon: "material-symbols:cancel-outline",
        click: () => handlers.cancel?.(row),
      },
      {
        label: "Reopen",
        icon: "material-symbols:door-open-outline",
        click: () => handlers.reopen?.(row),
      },
    ]);
  }

  actions.unshift([
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handlers.edit?.(row),
    },
  ]);

  return actions;
};

// const items: ITableActions = (row: any, handlers: IHandlers) => [
//   [
//     {
//       label: "Edit",
//       icon: "i-heroicons-pencil-square-20-solid",
//       click: () => handlers.edit?.(row),
//     },
//   ],
//   [
//     {
//       label: "Accept",
//       icon: "material-symbols:assignment-add-outline",
//       click: () => handlers.accept?.(row),
//     },
//     {
//       label: "Check Stock",
//       icon: "material-symbols:checked-bag-question-outline",
//       click: () => handlers.checkStock?.(row),
//     },
//     {
//       label: "Await Stock",
//       icon: "material-symbols:deployed-code-history-outline",
//       click: () => handlers.awaitStock?.(row),
//     },
//     {
//       label: "Resolve",
//       icon: "material-symbols:check-circle-outline",
//       click: () => handlers.resolve?.(row),
//     },
//     {
//       label: "Cancel",
//       icon: "material-symbols:cancel-outline",
//       click: () => handlers.cancel?.(row),
//     },
//     {
//       label: "Reopen",
//       icon: "material-symbols:door-open-outline",
//       click: () => handlers.reopen?.(row),
//     },
//   ],
//   // [
//   //   {
//   //     label: "Archive",
//   //     icon: "i-heroicons-archive-box-20-solid",
//   //   },
//   //   {
//   //     label: "Move",
//   //     icon: "i-heroicons-arrow-right-circle-20-solid",
//   //   },
//   // ],
//   // [
//   //   {
//   //     label: "Delete",
//   //     icon: "i-heroicons-trash-20-solid",
//   //     click: () => handlers.delete?.(row),
//   //   },
//   // ],
// ];

const expandableDetails: ITableExpandableDetails = (row: any) => [
  {
    key: "concern",
    label: "Concern",
    value: row.concern,
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
