export { columns, items };

const columns: ITableColumns[] = [
  {
    key: "full_name",
    label: "Name",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "employee_id_number",
    label: "ID",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "office_full",
    label: "Office",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "position_type",
    label: "Position",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  // {
  //   key: "actions",
  //   rowClass: "whitespace-pre-line max-w-fit text-center",
  // },
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

const tabItems = [
  { label: "All Tickets", value: "all", icon: "i-heroicons-list-bullet" },
  {
    label: "Open Tickets",
    value: "open",
    icon: "material-symbols-light:adjust-outline",
  },
  {
    label: "Accepted by Me",
    value: "accepted_by_me",
    icon: "material-symbols:assignment-add-outline",
  },
  {
    label: "Accepted by Others",
    value: "accepted_by_others",
    icon: "material-symbols-light:person-check-outline-rounded",
  },
  {
    label: "Closed Tickets",
    value: "closed",
    icon: "material-symbols-light:line-end-circle-outline-rounded",
  },
  // {
  //   label: "Other Agency",
  //   value: "other_agency",
  //   icon: "material-symbols-light:line-end-circle-outline-rounded",
  // },
];
