const { can } = useCan();
export { columns, items };

const columns: ITableColumns[] = [
  {
    key: "control_number",
    label: "Control No.",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "requestor_name",
    label: "Requestor",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "department_office",
    label: "Department/Office",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "date_of_request_formatted",
    label: "Date of Request",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "actions",
    rowClass: "whitespace-pre-line max-w-fit text-center",
  },
];

const items: ITableActions = (row: any, handlers: IHandlers) => {
  const actions: any[] = [];
  const rowActions: any[] = [];

  if (can("requests.other_it_services.update")) {
    rowActions.push({
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handlers.edit?.(row),
    });
  }

  if (can("requests.other_it_services.print")) {
    rowActions.push({
      label: "Print",
      icon: "material-symbols:print-outline",
      click: () => handlers.print?.(row),
    });
  }

  if (rowActions.length > 0) {
    actions.push(rowActions);
  }

  return actions;
};
