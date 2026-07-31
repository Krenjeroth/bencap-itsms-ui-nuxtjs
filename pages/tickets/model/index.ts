// const authStore = useAuthStore();
const { hasRole } = useRoleHandler();
const { can } = useCan();
export { columns, items, expandableDetails, queryStatusOptions, tabItems };

const columns: ITableColumns[] = [
  {
    key: "ticket_number",
    label: "Ticket Number",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "property_number",
    label: "Property Number",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "full_name",
    label: "Full Name",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "client_name",
    label: "Client Name",
    rowClass: "whitespace-pre-line max-w-fit",
  },
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
  const adminActions: any[] = [];

  const isAdminPersonnel = hasRole("admin");
  const isITAdminStaff = hasRole("it admin staff");
  const isITTechnical = hasRole("it technical");
  const canUpdate = can("tickets.update");
  const canPrintAssessment = can("tickets.print_assessment");

  if (canUpdate) {
    adminActions.unshift({
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handlers.edit?.(row),
    });

    if (row.service_method === "pulled_out") {
      adminActions.push({
        label: "Set Release Date",
        icon: "i-heroicons-calendar-20-solid",
        click: () => handlers.setReleaseDate?.(row),
      });
    }

    if (adminActions.length > 0) {
      actions.unshift(adminActions);
    }
  }

  if (
    (isAdminPersonnel || isITAdminStaff || isITTechnical) &&
    row.can_accept &&
    canUpdate
  ) {
    actions.push([
      {
        label: "Accept",
        icon: "material-symbols:assignment-add-outline",
        click: () => handlers.accept?.(row),
      },
    ]);
  }

  const canManageTicket =
    canUpdate ||
    ((isAdminPersonnel || isITAdminStaff || isITTechnical) &&
      row.is_accepted_by_me);

  const canAccessAssessedActions = canManageTicket || canPrintAssessment;

  if (canAccessAssessedActions) {
    if (["resolved", "closed"].includes(row.query_status)) {
      if (canManageTicket) {
        actions.push([
          {
            label: "Reopen",
            icon: "material-symbols:door-open-outline",
            click: () => handlers.reopen?.(row),
          },
        ]);
      }
      return actions;
    }

    if (row.query_status === "cancelled") {
      if (canManageTicket) {
        actions.push([
          {
            label: "Reopen",
            icon: "material-symbols:door-open-outline",
            click: () => handlers.reopen?.(row),
          },
        ]);
      }
      return actions;
    }

    if (row.query_status === "assessed") {
      const assessedActions: any[] = [];

      if (canPrintAssessment) {
        assessedActions.push({
          label: "Print Assessment",
          icon: "material-symbols:print-outline",
          click: () => handlers.printAssessment?.(row),
        });
      }

      if (canManageTicket) {
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

    if (canManageTicket) {
      const acceptedActions: any[] = [];

      if (row.query_status !== "awaiting_part") {
        acceptedActions.push({
          label: "Await Part",
          icon: "material-symbols:deployed-code-history-outline",
          click: () => handlers.awaitPart?.(row),
        });
      }

      acceptedActions.push(
        {
          label: "Assess",
          icon: "material-symbols:lab-research-outline",
          click: () => handlers.assess?.(row),
        },
        {
          label: "Resolve",
          icon: "material-symbols:check-circle-outline",
          click: () => handlers.resolve?.(row),
        },
      );

      if (row.query_status !== "cancelled") {
        acceptedActions.push({
          label: "Cancel",
          icon: "material-symbols:cancel-outline",
          click: () => handlers.cancel?.(row),
        });
      }

      if (acceptedActions.length > 0) {
        actions.push(acceptedActions);
      }

      actions.push([
        {
          label: "Set Service Method",
          icon: "material-symbols:build-circle-outline",
          click: () => handlers.setServiceMethod?.(row),
        },
      ]);
    }
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
