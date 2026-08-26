export { columns, items };

const { can } = useCan();

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
      hidden: !can("brand_models.update"),
    },
  ].filter((i) => !i.hidden),
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
      hidden: !can("brand_models.delete"),
    },
  ].filter((i) => !i.hidden),
];
