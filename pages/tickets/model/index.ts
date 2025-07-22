// const authStore = useAuthStore();
const { hasRole } = useRoleHandler();

export { columns, items, expandableDetails, queryStatusOptions, tabItems };

const columns: ITableColumns[] = [
  {
    key: "ticket_number",
    label: "Ticket Number",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "employee.full_name",
    label: "Employee",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_type.type",
    label: "Item Type",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "concern",
    label: "Concern",
    rowClass: "whitespace-pre-line max-w-fit",
    // responsiveClass: "hidden md:table-cell",
  },
  {
    key: "query_status_formatted",
    label: "Query Status",
    rowClass: "max-w-fit",
  },
  {
    key: "request_status_formatted",
    label: "Request Status",
    rowClass: "max-w-fit",
  },
  {
    key: "priority_formatted",
    label: "Priority",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "service_method_formatted",
    label: "Service Method",
    rowClass: "max-w-fit",
  },
  {
    key: "date_formatted",
    label: "Request Date",
    rowClass: "whitespace-pre-line max-w-fit",
    responsiveClass: "hidden md:table-cell",
  },
  {
    key: "personnel",
    label: "Personnel In Charge",
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
    key: "solution_formatted",
    label: "Solution",
    value: row.solution_formatted,
  },
];

const queryStatusOptions: ITableStatusOptions[] = [
  { key: "all", label: "All", value: "" },
  { key: "queued", label: "Queued", value: "queued" },
  { key: "in_progress", label: "In Progress", value: "in_progress" },
  { key: "awaiting_part", label: "Awaiting Part", value: "awaiting_part" },
  { key: "resolved", label: "Resolved", value: "resolved" },
  { key: "cancelled", label: "Cancelled", value: "cancelled" },
  { key: "reopened", label: "Reopened", value: "reopened" },
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
