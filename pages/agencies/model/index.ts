export { columns, items };

const { can } = useCan();

const columns: ITableColumns[] = [
  {
    key: "name",
    label: "Agency",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "abbreviation",
    label: "Abbreviation",
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
      hidden: !can("agencies.update"),
    },
  ].filter((i) => !i.hidden),
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
      hidden: !can("agencies.delete"),
    },
  ].filter((i) => !i.hidden),
];
