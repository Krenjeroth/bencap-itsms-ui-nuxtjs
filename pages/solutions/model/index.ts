// const authStore = useAuthStore();
const { hasRole } = useRoleHandler();

export { columns, items, classificationOptions, expandableDetails };

const columns: ITableColumns[] = [
  {
    key: "title",
    label: "Title",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "description",
    label: "Description",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "error_code",
    label: "Error Code",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "actions",
    rowClass: "whitespace-pre-line max-w-fit text-center",
  },
];

const items: ITableActions = (row: any, handlers: IHandlers) => {
  const actions: any[] = [];
  const adminActions: any[] = [];

  const isAdmin = hasRole("admin");
  const isPersonnel = hasRole("personnel");

  // Always show Edit
  if (isAdmin) {
    adminActions.unshift({
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handlers.edit?.(row),
    });

    // only show set release if query status === pulled out
    if (row.service_method === "pulled_out") {
      adminActions.push({
        label: "Set Release Date",
        icon: "i-heroicons-calendar-20-solid",
        click: () => handlers.setReleaseDate?.(row),
      });
    }
    actions.unshift(adminActions);
  }

  // Enable if personnel can set release date
  // if (isPersonnel) {
  //   actions.unshift([
  //     {
  //       label: "Set Release Date",
  //       icon: "i-heroicons-calendar-20-solid",
  //       click: () => handlers.edit?.(row),
  //     },
  //   ]);
  // }

  // Accept only if user hasn't accepted and ticket is still joinable
  if (isPersonnel && row.can_accept) {
    actions.push([
      {
        label: "Accept",
        icon: "material-symbols:assignment-add-outline",
        click: () => handlers.accept?.(row),
      },
    ]);
  }

  // Actions for accepted personnel
  if (isAdmin || (isPersonnel && row.is_accepted_by_me)) {
    const acceptedActions = [];

    // if (row.query_status !== "checking_stock") {
    //   acceptedActions.push({
    //     label: "Check Stock",
    //     icon: "material-symbols:checked-bag-question-outline",
    //     click: () => handlers.checkStock?.(row),
    //   });
    // }

    // Reopen action if ticket is resolved or closed
    if (["resolved", "closed"].includes(row.query_status)) {
      actions.push([
        {
          label: "Reopen",
          icon: "material-symbols:door-open-outline",
          click: () => handlers.reopen?.(row),
        },
      ]);
      return actions;
    }

    // Reopen action if ticket is cancelled or closed
    if (["cancelled", "closed"].includes(row.query_status)) {
      actions.push([
        {
          label: "Reopen",
          icon: "material-symbols:door-open-outline",
          click: () => handlers.reopen?.(row),
        },
      ]);
      return actions;
    }

    if (row.query_status !== "awaiting_part") {
      acceptedActions.push({
        label: "Await Part",
        icon: "material-symbols:deployed-code-history-outline",
        click: () => handlers.awaitPart?.(row),
      });
    }

    acceptedActions.push({
      label: "Resolve",
      icon: "material-symbols:check-circle-outline",
      click: () => handlers.resolve?.(row),
    });

    if (row.query_status !== "cancelled") {
      acceptedActions.push({
        label: "Cancel",
        icon: "material-symbols:cancel-outline",
        click: () => handlers.cancel?.(row),
      });
    }

    actions.push(acceptedActions); // Group of accepted actions

    actions.push([
      {
        label: "Set Service Method",
        icon: "material-symbols:build-circle-outline",
        click: () => handlers.setServiceMethod?.(row),
      },
    ]);
  }

  return actions;
};

const expandableDetails: ITableExpandableDetails = (row: any) => [
  {
    key: "author.display_name",
    label: "Author",
    value: row.author.display_name,
  },
  {
    key: "reference_url",
    label: "Reference URL",
    value: row.reference_url,
  },
  {
    key: "description_updated_at_formatted",
    label: "Description Updated At",
    value: row.description_updated_at_formatted,
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
