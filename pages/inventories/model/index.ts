export { columns, items, classificationOptions, expandableDetails, tabItems };

const getEmployeeOfficeDisplay = (row: any) =>
  row.employee?.division ??
  row.employee?.unit ??
  row.inventory?.employee?.division ??
  row.inventory?.employee?.unit ??
  null;

const isMainInventoryRow = (row: any) => !!row.item_type?.is_main_inventory;

const getInventorySource = (row: any) =>
  isMainInventoryRow(row) ? row : row.inventory;

const columns: ITableColumns[] = [
  {
    key: "property_number",
    label: "Property Number",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "actual_user",
    label: "Actual User",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_location",
    label: "Item Location",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "brand_model_formatted",
    label: "Brand Model",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "component_classification",
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

  adminActions.push({
    label: "Edit",
    icon: "i-heroicons-pencil-square-20-solid",
    click: () => handlers.edit?.(row),
  });

  if (row.is_parent) {
    adminActions.push({
      label: "Add Component",
      icon: "material-symbols:add-link-rounded",
      click: () => handlers.addComponent?.(row),
    });
  }

  if (adminActions.length > 0) {
    actions.unshift(adminActions);
  }

  actions.push([
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
    },
  ]);

  return actions;
};

const expandableDetails: ITableExpandableDetails = (row: any) => {
  const source = getInventorySource(row);

  return [
    {
      key: row.employee
        ? "employee.office_desc"
        : "inventory.employee.office_desc",
      label: "Employee Office",
      value: row.employee
        ? row.employee?.office_desc
        : row.inventory?.employee?.office_desc,
      show: true,
    },
    // {
    //   key: row.employee ? "employee.division" : "inventory.employee.division",
    //   label: "Division / Section / Unit",
    //   value: getEmployeeOfficeDisplay(row),
    //   show: !!getEmployeeOfficeDisplay(row),
    // },
    {
      key: "ip_address",
      label: "IP Address",
      value: source?.ip_address,
      show: !!source?.ip_address,
    },
    {
      key: "mac_address",
      label: "MAC Address",
      value: source?.mac_address,
      show: !!source?.mac_address,
    },
    {
      key: "remarks",
      label: "Remarks",
      value: source?.remarks,
      show: !!source?.remarks,
    },
    {
      key: "date_acquired",
      label: "Date Acquired",
      value: row.date_acquired ?? row.inventory?.date_acquired,
      show: !!(row.date_acquired ?? row.inventory?.date_acquired),
    },
    {
      key: "serial_number",
      label: "Serial Number",
      value: row.serial_number,
      show: !!row.serial_number,
    },
    {
      key: "operating_system_name",
      label: "Operating System Name",
      value: source?.operating_system_name,
      show: !!source?.operating_system_name,
    },
    {
      key: "os_license_number",
      label: "OS License Number",
      value: source?.os_license_number,
      show: !!source?.os_license_number,
    },
    {
      key: "anti_virus_name",
      label: "Anti Virus Name",
      value: source?.anti_virus_name,
      show: !!source?.anti_virus_name,
    },
    {
      key: "anti_virus_license_number",
      label: "Anti Virus License Number",
      value: source?.anti_virus_license_number,
      show: !!source?.anti_virus_license_number,
    },
    {
      key: "microsoft_office_name",
      label: "Microsoft Office Name",
      value: source?.microsoft_office_name,
      show: !!source?.microsoft_office_name,
    },
    {
      key: "ms_office_license_number",
      label: "MS Office License Number",
      value: source?.ms_office_license_number,
      show: !!source?.ms_office_license_number,
    },
    {
      key: "internal_components.id",
      label: "Internal Components",
      value: source?.internal_components,
      show:
        Array.isArray(source?.internal_components) &&
        source.internal_components.length > 0,
    },
    {
      key: "other_installed_applications",
      label: "Other Installed Applications",
      value: source?.other_installed_applications,
      show: !!source?.other_installed_applications,
    },
  ];
};

const tabItems = [
  { label: "All", value: "all", icon: "i-heroicons-list-bullet" },
  {
    label: "Parent Components",
    value: "parent_components",
    icon: "material-symbols-light:adjust-outline",
  },
  {
    label: "Child Components",
    value: "child_components",
    icon: "material-symbols:assignment-add-outline",
  },
  // {
  //   label: "Accepted by Others",
  //   value: "accepted_by_others",
  //   icon: "material-symbols-light:person-check-outline-rounded",
  // },
  // {
  //   label: "Closed Tickets",
  //   value: "closed",
  //   icon: "material-symbols-light:line-end-circle-outline-rounded",
  // },
  // {
  //   label: "Other Agency",
  //   value: "other_agency",
  //   icon: "material-symbols-light:line-end-circle-outline-rounded",
  // },
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
