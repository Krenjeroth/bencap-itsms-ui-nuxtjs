// const authStore = useAuthStore();
// const { hasRole } = useRoleHandler();
const { can } = useCan();
export { columns, items, expandableDetails, queryStatusOptions, tabItems };

const columns: ITableColumns[] = [
  {
    key: "ticket_number",
    label: "Ticket Number",
    sortable: true,
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "property_number",
    label: "Property Number",
    sortable: true,
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "full_name",
    label: "Inventory",
    sortable: true,
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "client",
    label: "Client",
    sortable: true,
    rowClass: "whitespace-pre-line max-w-fit",
  },
  // {
  //   key: "office_label",
  //   label: "Office",
  //   rowClass: "whitespace-pre-line max-w-fit",
  // },
  {
    key: "item_type_label",
    label: "Item Type",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "concern",
    label: "Concern",
    rowClass: "whitespace-pre-line max-w-fit",
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

  const canUpdate = can("tickets.update");
  const canAccept = can("tickets.accept");
  const canUnaccept = can("tickets.unaccept");
  const canCheckStock = can("tickets.check_stock");
  const canAwaitPart = can("tickets.await_part");
  const canResolve = can("tickets.resolve");
  const canCancel = can("tickets.cancel");
  const canReopen = can("tickets.reopen");
  const canSetServiceMethod = can("tickets.set_service_method");
  const canSetReleaseDate = can("tickets.set_release_date");
  const canAssess = can("tickets.assess");
  const canPrintAssessment = can("tickets.print_assessment");

  const editActions: any[] = [];

  if (canUpdate) {
    editActions.push({
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handlers.edit?.(row),
    });
  }

  if (canSetReleaseDate && row.service_method === "pulled_out") {
    editActions.push({
      label: "Set Release Date",
      icon: "i-heroicons-calendar-20-solid",
      click: () => handlers.setReleaseDate?.(row),
    });
  }

  if (editActions.length > 0) {
    actions.push(editActions);
  }

  if (canAccept && row.can_accept) {
    actions.push([
      {
        label: "Accept",
        icon: "material-symbols:assignment-add-outline",
        click: () => handlers.accept?.(row),
      },
    ]);
  }

  if (canUnaccept && row.can_unaccept) {
    actions.push([
      {
        label: "Un-accept",
        icon: "material-symbols:assignment-return-outline",
        click: () => handlers.unaccept?.(row),
      },
    ]);
  }

  const isTerminalStatus = ["resolved", "closed", "cancelled"].includes(
    row.query_status,
  );

  if (isTerminalStatus) {
    const terminalActions: any[] = [];

    if (canReopen) {
      terminalActions.push({
        label: "Reopen",
        icon: "material-symbols:door-open-outline",
        click: () => handlers.reopen?.(row),
      });
    }

    if (canPrintAssessment && row.assessment) {
      terminalActions.push({
        label: "Print Assessment",
        icon: "material-symbols:print-outline",
        click: () => handlers.printAssessment?.(row),
      });
    }

    if (terminalActions.length > 0) {
      actions.push(terminalActions);
    }

    return actions;
  }

  if (row.query_status === "assessed") {
    const assessedActions: any[] = [];

    if (canAssess && row.is_accepted_by_me) {
      assessedActions.push({
        label: row.assessment ? "Edit Assessment" : "Assess",
        icon: "material-symbols:lab-research-outline",
        click: () => handlers.assess?.(row),
      });
    }

    if (canPrintAssessment) {
      assessedActions.push({
        label: "Print Assessment",
        icon: "material-symbols:print-outline",
        click: () => handlers.printAssessment?.(row),
      });
    }

    if (canReopen) {
      assessedActions.push({
        label: "Reopen",
        icon: "material-symbols:door-open-outline",
        click: () => handlers.reopen?.(row),
      });
    }

    if (assessedActions.length > 0) {
      actions.push(assessedActions);
    }

    return actions;
  }

  const lifecycleActions: any[] = [];

  if (canCheckStock && row.is_accepted_by_me) {
    lifecycleActions.push({
      label: "Check Stock",
      icon: "material-symbols:inventory-2-outline",
      click: () => handlers.checkStock?.(row),
    });
  }

  if (
    canAwaitPart &&
    row.is_accepted_by_me &&
    row.query_status !== "awaiting_part"
  ) {
    lifecycleActions.push({
      label: "Await Part",
      icon: "material-symbols:deployed-code-history-outline",
      click: () => handlers.awaitPart?.(row),
    });
  }

  if (canAssess && row.is_accepted_by_me) {
    lifecycleActions.push({
      label: "Assess",
      icon: "material-symbols:lab-research-outline",
      click: () => handlers.assess?.(row),
    });
  }

  if (canResolve && row.is_accepted_by_me) {
    lifecycleActions.push({
      label: "Resolve",
      icon: "material-symbols:check-circle-outline",
      click: () => handlers.resolve?.(row),
    });
  }

  if (canCancel && row.is_accepted_by_me && row.query_status !== "cancelled") {
    lifecycleActions.push({
      label: "Cancel",
      icon: "material-symbols:cancel-outline",
      click: () => handlers.cancel?.(row),
    });
  }

  // if (canSetServiceMethod && row.is_accepted_by_me) {
  if (canSetServiceMethod) {
    lifecycleActions.push({
      label: "Set Service Method",
      icon: "material-symbols:build-circle-outline",
      click: () => handlers.setServiceMethod?.(row),
    });
  }

  if (lifecycleActions.length > 0) {
    actions.push(lifecycleActions);
  }

  return actions;
};

const expandableDetails: ITableExpandableDetails = (row: any) => [
  {
    key: "solution_formatted",
    label: "Solution",
    value: row.solution_formatted,
    show: true,
  },
  {
    key: "remarks",
    label: "Remarks",
    value:
      row.inventory?.remarks ?? row.inventory?.inventory?.remarks ?? "None",
    show: true,
  },
];

const queryStatusOptions: ITableStatusOptions[] = [
  { key: "all", label: "All", value: "" },
  { key: "queued", label: "Queued", value: "queued" },
  { key: "in_progress", label: "In Progress", value: "in_progress" },
  { key: "awaiting_part", label: "Awaiting Part", value: "awaiting_part" },
  { key: "resolved", label: "Resolved", value: "resolved" },
  { key: "cancelled", label: "Cancelled", value: "cancelled" },
  { key: "assessed", label: "Assessed", value: "assessed" },
  // { key: "reopened", label: "Reopened", value: "reopened" },
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
