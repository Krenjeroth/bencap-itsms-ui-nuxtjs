export { columns, items, statusOptions };

const columns: ITableColumns[] = [
  {
    key: "photo",
  },
  {
    key: "username",
    label: "Username",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "profile.display_name",
    label: "Display Name",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "email",
    label: "Email",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "roles",
    label: "Roles",
    rowClass: "whitespace-pre-line max-w-auto overflow-x-auto",
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

const statusOptions: ITableStatusOptions[] = [
  { key: "all", label: "All", value: "" },
  { key: "active", label: "Active", value: 1 },
  { key: "inactive", label: "Inactive", value: 0 },
];
