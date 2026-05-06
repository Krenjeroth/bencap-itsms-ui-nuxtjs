export { columns, items, classificationOptions, expandableDetails, tabItems };

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

  // Always show Edit
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

const expandableDetails: ITableExpandableDetails = (row: any) => [
  {
    key: row.employee
      ? "employee.office_desc"
      : "inventory.employee.office_desc",
    label: "Office",
    value: row.employee
      ? row.employee?.office_desc
      : row.inventory?.employee?.office_desc,
    show: true,
  },
  {
    key: row.employee ? "employee.division" : "inventory.employee.division",
    label: "Division / Section / Unit",
    value: getEmployeeOfficeDisplay(row),
    show: !!getEmployeeOfficeDisplay(row),
  },
  {
    key: "ip_address",
    label: "IP Address",
    value: row.item_type.id === 1 ? row.ip_address : row.inventory?.ip_address,
    show:
      row.item_type.id === 1 ? !!row.ip_address : !!row.inventory?.ip_address,
  },
  {
    key: "mac_address",
    label: "MAC Address",
    value:
      row.item_type.id === 1 ? row.mac_address : row.inventory?.mac_address,
    show:
      row.item_type.id === 1 ? !!row.mac_address : !!row.inventory?.mac_address,
  },
  {
    key: "remarks",
    label: "Remarks",
    value: row.item_type.id === 1 ? row.remarks : row.inventory?.remarks,
    show: row.item_type.id === 1 ? !!row.remarks : !!row.inventory?.remarks,
  },
  {
    key: "date_acquired",
    label: "Date Acquired",
    value:
      row.item_type.id === 1 ? row.date_acquired : row.inventory?.date_acquired,
    show:
      row.item_type.id === 1
        ? !!row.date_acquired
        : !!row.inventory?.date_acquired,
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
    value: row.operating_system_name,
    show: row.item_type.id === 1,
  },
  {
    key: "os_license_number",
    label: "OS License Number",
    value: row.os_license_number,
    show: row.item_type.id === 1,
  },
  {
    key: "anti_virus_name",
    label: "Anti Virus Name",
    value: row.anti_virus_name,
    show: row.item_type.id === 1,
  },
  {
    key: "anti_virus_license_number",
    label: "Anti Virus License Number",
    value: row.anti_virus_license_number,
    show: row.item_type.id === 1,
  },
  {
    key: "microsoft_office_name",
    label: "Microsoft Office Name",
    value: row.microsoft_office_name,
    show: row.item_type.id === 1,
  },
  {
    key: "ms_office_license_number",
    label: "MS Office License Number",
    value: row.ms_office_license_number,
    show: row.item_type.id === 1,
  },
  {
    key: "internal_components.id",
    label: "Internal Components",
    value: row.internal_components,
    show: row.item_type.id === 1,
  },
  {
    key: "other_installed_applications",
    label: "Other Installed Applications",
    value: row.other_installed_applications,
    show: row.item_type.id === 1,
  },
];

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

const getEmployeeOfficeDisplay = (row: any) =>
  row.employee?.division ??
  row.employee?.unit ??
  row.inventory?.employee?.division ??
  row.inventory?.employee?.unit ??
  null;
