export { columns, items, classificationOptions, expandableDetails };

const { can } = useCan();

const columns: ITableColumns[] = [
  {
    key: "stock_number",
    label: "Stock #",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "item_number",
    label: "Item #",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "ics_number",
    label: "ICS #",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "iar_number",
    label: "IAR #",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "po_number",
    label: "PO #",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "measurement_unit.abbreviation",
    label: "Unit",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "description",
    label: "Description",
    rowClass: "whitespace-pre-line max-w-fit",
  },
  {
    key: "quantity",
    label: "Quantity",
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
      hidden: !can("it_supplies.update"),
    },
  ].filter((i) => !i.hidden),
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handlers.delete?.(row),
      hidden: !can("it_supplies.delete"),
    },
  ].filter((i) => !i.hidden),
];

const expandableDetails: ITableExpandableDetails = (row: any) => [
  // {
  //   key: "brand_model.item_type.type",
  //   label: "Type",
  //   value: row.brand_model.item_type.type,
  // },
  // {
  //   key: "brand_model.item_type.classification",
  //   label: "Classification",
  //   value: row.brand_model.item_type.classification,
  // },
  // {
  //   key: "brand_model.item_type.purpose",
  //   label: "Purpose",
  //   value: row.brand_model.item_type.purpose,
  // },
  {
    key: "employee.full_name",
    label: "Issued To",
    value: row.employee.full_name,
    show: true,
  },
  {
    key: "description",
    label: "Description",
    value: row.description,
    show: true,
  },
  {
    key: "serial_number",
    label: "Serial Number",
    value: row.serial_number,
    show: true,
  },
  {
    key: "ics_number",
    label: "ICS Number",
    value: row.ics_number,
    show: true,
  },
  {
    key: "date_acquired",
    label: "Date Acquired",
    value: row.date_acquired,
    show: true,
  },
  {
    key: "inventory_type",
    label: "Inventory Type",
    value: row.inventory_type,
    show: true,
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
