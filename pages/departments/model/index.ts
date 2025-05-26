export { columns, items };

const columns: ITableColumns[] = [
  {
    key: "full_name",
    label: "Dept. Name",
    sortable: true,
    direction: "desc",
  },
  {
    key: "division",
    label: "Division",
  },
  {
    key: "abbreviation",
    label: "Abbreviation",
  },
  {
    key: "actions",
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
