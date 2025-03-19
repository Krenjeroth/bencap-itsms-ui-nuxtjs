export { columns, items, statusOptions };

const columns: ITableColumns[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    direction: "desc",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "created_at",
    label: "Created At",
  },
  {
    key: "actions",
  },
];

const items: ITableActions = (row: any, editUserModal: (user: any) => void) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => editUserModal(row),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
    },
  ],
];

const statusOptions: ITableStatusOptions[] = [
  { key: "all", label: "All", value: "" },
  { key: "active", label: "Active", value: 1 },
  { key: "inactive", label: "Inactive", value: 0 },
];
