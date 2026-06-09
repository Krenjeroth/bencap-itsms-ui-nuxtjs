export { columns, items, statusOptions };

const { can } = useCan();

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
    key: "offices_agencies_assigned",
    label: "Assigned Offices / Agencies",
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
      hidden: !can("users.update"),
    },
  ].filter((i) => !i.hidden),
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
      hidden: !can("users.delete"),
    },
  ].filter((i) => !i.hidden),
];

const statusOptions: ITableStatusOptions[] = [
  { key: "all", label: "All", value: "" },
  { key: "active", label: "Active", value: 1 },
  { key: "inactive", label: "Inactive", value: 0 },
];
