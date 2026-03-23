export { columns, items };

const columns: ITableColumns[] = [
  {
    key: "brand.name",
    label: "Brand",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "name",
    label: "Model",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "specification",
    label: "Specification",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  // {
  //   key: "year_released",
  //   label: "Year Released",
  //   rowClass: "whitespace-pre-line max-w-fit",
  // },
  {
    key: "item_type.type",
    label: "Type",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_type.classification",
    label: "Classification",
    sortable: true,
    direction: "desc",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_type.purpose",
    label: "Purpose",
    sortable: true,
    direction: "desc",
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
