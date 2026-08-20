<script setup lang="ts">
import { format } from "date-fns";
import { cloneDeep, isEqual } from "lodash";

const inventoryStore = useInventoryStore();
const {
  loading: loadingInventories,
  errorBag,
  hasError,
} = storeToRefs(inventoryStore);

const brandModelStore = useBrandModelStore();
const { loading: loadingBrandModels } = storeToRefs(brandModelStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

const itemTypeStore = useItemTypeStore();

const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);

itemTypeStore.fetchItemTypeSelect();

const officeStore = useOfficeStore();
const { loadingOfficeSearch: loadingOffices } = storeToRefs(officeStore);

const { transformDbDate } = useDateHandler();

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  inventoryItem: Object,
});

const { capitalizeAll } = useStringHandler();

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const onNoDataChange = () => {
  emit("noDataChange");
};

const sanitizeInternalComponents = (rows: any[] = []) =>
  rows.filter((row) => row?.id);

const sanitizeOriginalInternalComponents = (rows: any[] = []) =>
  rows.filter((row) => row?.id);

const isInitializing = ref(true);

const isMeaningfulInternalComponentRow = (row: any) =>
  !!(
    row?.id ||
    row?.brand_model?.id ||
    row?.specific_serial_number ||
    row?.slot ||
    row?.notes
  );

const normalizeEmployee = (employee: any) => {
  if (!employee) return undefined;

  return {
    ...employee,
    full_name: employee.full_name ?? employee.fullname ?? "",
  };
};

const normalizeOffice = (item: any) => {
  if (!item?.office_id) {
    return undefined;
  }

  return {
    id: item.office_id,
    office_code: item?.office_code ?? "",
    office_desc: item?.office_name ?? "",
    divisions: item?.office?.divisions ?? item?.divisions ?? [],
    label:
      item?.office_code && item?.office_name
        ? `${item.office_code} - ${item.office_name}`
        : (item?.office_name ?? item?.office_code ?? ""),
  };
};

const normalizeDivision = (item: any) => {
  if (!item?.division_id) return undefined;

  return {
    id: item.division_id,
    division: item?.division_name ?? "",
    label: item?.division_name ?? "",
  };
};

const normalizeDivisionOption = (division: any) => ({
  id: division.id,
  division: division.division,
  label: division.division,
});

const normalizeInternalComponentsForCompare = (rows: any[] = []) =>
  rows.filter(isMeaningfulInternalComponentRow).map((row) => ({
    id: row.id ?? null,
    brand_model_id: row.brand_model?.id ?? null,
    quantity: Number(row.quantity ?? 0),
    specific_serial_number: row.specific_serial_number ?? null,
    slot: row.slot ?? null,
    notes: row.notes ?? null,
  }));

const hydrateSelectedOffice = async () => {
  if (!formState.office?.id) return;

  const offices =
    officeStore.officeSelect.length > 0
      ? officeStore.officeSelect
      : await officeStore.fetchOfficeSelect();

  const matched = offices.find(
    (office: any) => office.id === formState.office?.id,
  );

  if (matched) {
    formState.office = matched;
    originalState.value = Object.freeze({
      ...cloneDeep(originalState.value),
      office: cloneDeep(matched),
    }) as IUpdateInventoryForm;
    syncOfficeOption(matched);
  }
};

const buildFormState = (item: any): IUpdateInventoryForm => ({
  employee: normalizeEmployee(item?.employee),
  item_type: item?.item_type?.id || undefined,
  brand_model: item?.brand_model || undefined,

  ip_address: item?.ip_address || undefined,
  mac_address: item?.mac_address || undefined,
  remarks: item?.remarks || undefined,

  operating_system_name: item?.operating_system_name || undefined,
  os_license_number: item?.os_license_number || undefined,
  anti_virus_name: item?.anti_virus_name || undefined,
  anti_virus_license_number: item?.anti_virus_license_number || undefined,
  microsoft_office_name: item?.microsoft_office_name || undefined,
  ms_office_license_number: item?.ms_office_license_number || undefined,
  other_installed_applications: item?.other_installed_applications || undefined,

  property_number: item?.property_number || undefined,
  date_acquired: item?.date_acquired
    ? transformDbDate(item.date_acquired)
    : item?.inventory?.date_acquired
      ? transformDbDate(item.inventory.date_acquired)
      : undefined,
  warranty_expiration_date: item?.warranty_expiration_date
    ? transformDbDate(item.warranty_expiration_date)
    : item?.inventory?.warranty_expiration_date
      ? transformDbDate(item.inventory.warranty_expiration_date)
      : undefined,
  serial_number: item?.serial_number || undefined,
  status: item?.status || undefined,

  internal_components: sanitizeOriginalInternalComponents(
    item?.internal_components || [],
  ),
  inventory: item?.inventory
    ? {
        id: item.inventory.id,
        property_number: item.inventory.property_number,
      }
    : undefined,

  office: normalizeOffice(item),
  division: normalizeDivision(item),
});

const formState = reactive<IUpdateInventoryForm>(
  buildFormState(props.inventoryItem),
);

const originalState = ref<IUpdateInventoryForm>(
  cloneDeep(buildFormState(props.inventoryItem)),
);

const fieldsToCompare: (keyof IUpdateInventoryForm)[] = [
  "employee",
  "item_type",
  "brand_model",

  "ip_address",
  "mac_address",
  "remarks",

  "operating_system_name",
  "os_license_number",
  "anti_virus_name",
  "anti_virus_license_number",
  "microsoft_office_name",
  "ms_office_license_number",
  "other_installed_applications",

  "property_number",
  "date_acquired",
  "warranty_expiration_date",
  "serial_number",
  "status",

  "internal_components",
  "inventory",

  "office",
  "division",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a =
      key === "internal_components"
        ? normalizeInternalComponentsForCompare(formState.internal_components)
        : formState[key];

    const b =
      key === "internal_components"
        ? normalizeInternalComponentsForCompare(
            originalState.value.internal_components,
          )
        : originalState.value[key];

    return !isEqual(a, b);
  });
});

const serialNumberValue = computed({
  get: () => formState.serial_number ?? undefined,
  set: (val) => {
    formState.serial_number = val;
  },
});

const ipAddressValue = computed({
  get: () => formState.ip_address ?? undefined,
  set: (val) => {
    formState.ip_address = val;
  },
});

const macAddressValue = computed({
  get: () => formState.mac_address ?? undefined,
  set: (val) => {
    formState.mac_address = val;
  },
});

const itemTypeComputed = computed({
  get: () => formState.item_type ?? undefined,
  set: (value) => {
    formState.item_type = value ? Number(value) : undefined;
  },
});

const operatingSystemNameComputed = computed({
  get: () => formState.operating_system_name ?? undefined,
  set: (value) => {
    formState.operating_system_name = value;
  },
});

const osLicenseNumberComputed = computed({
  get: () => formState.os_license_number ?? undefined,
  set: (value) => {
    formState.os_license_number = value;
  },
});

const antiVirusNameComputed = computed({
  get: () => formState.anti_virus_name ?? undefined,
  set: (value) => {
    formState.anti_virus_name = value;
  },
});

const antiVirusLicenseNumberComputed = computed({
  get: () => formState.anti_virus_license_number ?? undefined,
  set: (value) => {
    formState.anti_virus_license_number = value;
  },
});

const microsoftOfficeNameComputed = computed({
  get: () => formState.microsoft_office_name ?? undefined,
  set: (value) => {
    formState.microsoft_office_name = value;
  },
});

const msOfficeLicenseNumberComputed = computed({
  get: () => formState.ms_office_license_number ?? undefined,
  set: (value) => {
    formState.ms_office_license_number = value;
  },
});

const otherInstalledApplicationsComputed = computed({
  get: () => formState.other_installed_applications ?? undefined,
  set: (value) => {
    formState.other_installed_applications = value;
  },
});

const remarksComputed = computed({
  get: () => formState.remarks ?? undefined,
  set: (value) => {
    formState.remarks = value;
  },
});

const employeeComputed = computed({
  get: () => formState.employee ?? undefined,
  set: (value) => {
    formState.employee = value ? value : undefined;
  },
});

const officeComputed = computed({
  get: () => formState.office ?? undefined,
  set: (value) => {
    formState.office = value ? value : undefined;
  },
});

const brandModelComputed = computed({
  get: () => formState.brand_model ?? undefined,
  set: (value) => {
    formState.brand_model = value ? value : undefined;
  },
});

const inventoryComputed = computed({
  get: () => formState.inventory ?? undefined,
  set: (value) => {
    formState.inventory = value ? value : undefined;
  },
});

const selectedItemType = computed<TItemTypeSelectOption | undefined>(() =>
  itemTypeSelect.value.find((t) => t.id === itemTypeComputed.value),
);

const isMainInventory = computed(
  () => !!selectedItemType.value?.is_main_inventory,
);

const isComponentType = computed(() => !!selectedItemType.value?.is_component);

const supportsInternalComponents = computed(
  () => !!selectedItemType.value?.supports_internal_components,
);

const hasParentComponent = computed(() => !!formState.inventory?.id);

const isStandaloneMainInventory = computed(() => {
  if (!isMainInventory.value) {
    return false;
  }

  if (isComponentType.value) {
    return !hasParentComponent.value;
  }

  return true;
});

const isChildComponent = computed(
  () => isComponentType.value && hasParentComponent.value,
);

const shouldShowInternalComponents = computed(
  () => isStandaloneMainInventory.value && supportsInternalComponents.value,
);

const showParentComponentField = computed(() => isComponentType.value);

const showsBasicInformation = computed(() => isStandaloneMainInventory.value);

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateInventoryValidationSchema>,
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  const payload: TUpdateInventoryPayload = {
    employee_id: isStandaloneMainInventory.value
      ? (formState.employee?.id ?? null)
      : null,

    office_id: isStandaloneMainInventory.value
      ? (formState.office?.id ?? null)
      : null,

    office_code: isStandaloneMainInventory.value
      ? (formState.office?.office_code ?? null)
      : null,

    office_name: isStandaloneMainInventory.value
      ? (formState.office?.office_desc ?? null)
      : null,

    division_id: isStandaloneMainInventory.value
      ? (formState.division?.id ?? null)
      : null,

    division_name: isStandaloneMainInventory.value
      ? (formState.division?.division ?? null)
      : null,

    item_type_id: formState.item_type ?? null,

    brand_model_id: isChildComponent.value
      ? (formState.brand_model?.id ?? null)
      : null,

    parent_component_id: isChildComponent.value
      ? (formState.inventory?.id ?? props.inventoryItem?.inventory?.id ?? null)
      : null,

    ip_address: isStandaloneMainInventory.value
      ? (formState.ip_address ?? null)
      : null,

    mac_address: isStandaloneMainInventory.value
      ? (formState.mac_address ?? null)
      : null,

    remarks: isStandaloneMainInventory.value
      ? (formState.remarks ?? null)
      : null,

    operating_system_name: isStandaloneMainInventory.value
      ? (formState.operating_system_name ?? null)
      : null,

    os_license_number: isStandaloneMainInventory.value
      ? (formState.os_license_number ?? null)
      : null,

    anti_virus_name: isStandaloneMainInventory.value
      ? (formState.anti_virus_name ?? null)
      : null,

    anti_virus_license_number: isStandaloneMainInventory.value
      ? (formState.anti_virus_license_number ?? null)
      : null,

    microsoft_office_name: isStandaloneMainInventory.value
      ? (formState.microsoft_office_name ?? null)
      : null,

    ms_office_license_number: isStandaloneMainInventory.value
      ? (formState.ms_office_license_number ?? null)
      : null,

    other_installed_applications: isStandaloneMainInventory.value
      ? (formState.other_installed_applications ?? null)
      : null,

    property_number: formState.property_number ?? "",

    date_acquired: isStandaloneMainInventory.value
      ? (formState.date_acquired ?? null)
      : null,

    warranty_expiration_date: isStandaloneMainInventory.value
      ? (formState.warranty_expiration_date ?? null)
      : null,

    serial_number: formState.serial_number ?? null,
    status: formState.status ?? null,

    internal_components: shouldShowInternalComponents.value
      ? (formState.internal_components ?? [])
      : [],
  };

  await inventoryStore.updateInventory(props.inventoryItem?.id, payload);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
};

const brandModelOptions = ref<TBrandModelSelectOption[]>([]);
const searchQuery = ref("");

const useGenericBrandModelSelect = computed(() => {
  return [1, 164].includes(Number(itemTypeComputed.value));
});

const searchBrandModels = async (q: string) => {
  searchQuery.value = q;
  if (!searchQuery.value || searchQuery.value.length < 2) return [];

  if (useGenericBrandModelSelect.value) {
    const result = await brandModelStore.fetchBrandModelSelect(
      searchQuery.value,
    );
    brandModelOptions.value = result;
    return result;
  }

  const result = await brandModelStore.fetchBrandModelSearch(
    searchQuery.value,
    itemTypeComputed.value,
  );
  brandModelOptions.value = result;
  return result;
};

const employeeOptions = ref<TEmployeeSelectOption[]>([]);
const employeeSearchQuery = ref("");

const syncEmployeeOption = (employee?: TEmployeeSelectOption | null) => {
  if (!employee) return;

  const exists = employeeOptions.value.some((opt) => opt.id === employee.id);
  if (!exists) {
    employeeOptions.value = [employee, ...employeeOptions.value];
  }
};

const searchEmployees = async (q: string) => {
  employeeSearchQuery.value = q;
  if (!employeeSearchQuery.value || employeeSearchQuery.value.length < 2) {
    return [];
  }

  const result = await employeeStore.fetchEmployeeSearch(
    employeeSearchQuery.value,
  );

  const normalized = result.map((employee: any) => normalizeEmployee(employee));
  employeeOptions.value = normalized;
  return normalized;
};

const officeOptions = ref<any[]>([]);
const officeSearchQuery = ref("");

const syncOfficeOption = (office?: any) => {
  if (!office?.id) return;

  const exists = officeOptions.value.some((opt) => opt.id === office.id);
  if (!exists) {
    officeOptions.value = [office, ...officeOptions.value];
  }
};

const searchOffices = async (q: string) => {
  officeSearchQuery.value = q;
  if (!officeSearchQuery.value || officeSearchQuery.value.length < 2) {
    return [];
  }

  const result = await officeStore.fetchOfficeSearch(officeSearchQuery.value);
  officeOptions.value = result ?? [];
  return officeOptions.value;
};

const inventoryMainAssetSearchOptions = ref<TInventorySelectOption[]>([]);
const inventoryMainAssetSearchQuery = ref("");

const searchInventoryMainAsset = async (q: string) => {
  inventoryMainAssetSearchQuery.value = q;
  if (
    !inventoryMainAssetSearchQuery.value ||
    inventoryMainAssetSearchQuery.value.length < 2
  )
    return [];
  const result = await inventoryStore.fetchInventoryMainAssetSearch(
    inventoryMainAssetSearchQuery.value,
  );
  inventoryMainAssetSearchOptions.value = result;
  return result;
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }
  const filtered = itemTypeSelect.value.filter((itemType) =>
    itemType.type.toLowerCase().includes(q.toLowerCase()),
  );
  return filtered;
};

const divisionComputed = computed({
  get: () => formState.division ?? undefined,
  set: (value) => {
    formState.division = value ? value : undefined;
  },
});

const divisionOptions = computed(() => {
  return officeComputed.value?.divisions?.map(normalizeDivisionOption) ?? [];
});

const createEmptyInternalComponent = () => ({
  brand_model: undefined,
  specific_serial_number: undefined,
  slot: undefined,
  quantity: 1,
  notes: undefined,
});

const clearStandaloneFields = () => {
  formState.employee = undefined;
  formState.office = undefined;
  formState.division = undefined;
  formState.ip_address = undefined;
  formState.mac_address = undefined;
  formState.remarks = undefined;
  formState.operating_system_name = undefined;
  formState.os_license_number = undefined;
  formState.anti_virus_name = undefined;
  formState.anti_virus_license_number = undefined;
  formState.microsoft_office_name = undefined;
  formState.ms_office_license_number = undefined;
  formState.other_installed_applications = undefined;
};

const syncInternalComponentRows = () => {
  if (!shouldShowInternalComponents.value) {
    formState.internal_components = [];
    return;
  }

  if (formState.internal_components.length === 0) {
    formState.internal_components.push(createEmptyInternalComponent());
  }
};

watch(officeComputed, (newOffice, oldOffice) => {
  if (newOffice?.id !== oldOffice?.id) {
    formState.division = undefined;
  }
});

watch(itemTypeComputed, async () => {
  if (isInitializing.value) {
    return;
  }

  await nextTick();

  if (isChildComponent.value) {
    formState.internal_components = [];
    clearStandaloneFields();
    return;
  }

  if (isStandaloneMainInventory.value) {
    if (supportsInternalComponents.value) {
      syncInternalComponentRows();
    } else {
      formState.internal_components = [];
    }

    return;
  }

  formState.internal_components = [];
});

watch(
  () => formState.inventory?.id,
  () => {
    if (isInitializing.value) {
      return;
    }

    if (isChildComponent.value) {
      formState.internal_components = [];
      clearStandaloneFields();
      return;
    }

    if (isStandaloneMainInventory.value) {
      syncInternalComponentRows();
    }
  },
);

watch(
  () => props.inventoryItem,
  async (item) => {
    isInitializing.value = true;

    const nextState = buildFormState(item);

    Object.assign(formState, nextState);

    originalState.value = Object.freeze(
      cloneDeep(nextState),
    ) as IUpdateInventoryForm;

    syncEmployeeOption(item?.employee);

    await hydrateSelectedOffice();

    syncOfficeOption(formState.office);

    await nextTick();

    isInitializing.value = false;
  },
  {
    immediate: true,
    deep: true,
  },
);

const addRow = () => {
  if (!shouldShowInternalComponents.value) {
    return;
  }

  formState.internal_components.push(createEmptyInternalComponent());
};

const removeRow = (index: number) => {
  if (formState.internal_components.length > 1) {
    formState.internal_components.splice(index, 1);
    return;
  }

  formState.internal_components = [];
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Update ${props.pageTitle}`"
    :ui="{ width: 'md:max-w-7xl' }"
  >
    <UForm
      :schema="updateInventoryValidationSchema(selectedItemType)"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Item Type"
          name="item_type"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelectMenu
            v-model="itemTypeComputed"
            :options="itemTypeSelect"
            :searchable="true"
            :search="searchItemTypes"
            :loading="loadingItemTypes"
            placeholder="Type to search..."
            value-attribute="id"
            option-attribute="type"
          >
            <template #option-empty="{ query }">
              <q>{{ query }}</q> not found
            </template>
            <template #empty> No Item Type found </template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <div v-if="showsBasicInformation" class="space-y-6">
        <UDivider label="Basic Information" />
        <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
          <UFormGroup
            label="Employee (Actual End-User)"
            name="employee"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInputMenu
              v-model="employeeComputed"
              :search="searchEmployees"
              :loading="loadingEmployees"
              placeholder="Type to search..."
              option-attribute="full_name"
            >
              <template #option="{ option }">
                <span class="truncate">{{ option.full_name }}</span>
              </template>
              <template #empty>
                <span
                  v-if="employeeSearchQuery.length < 2"
                  class="text-gray-400"
                  >Type at least 2 characters...</span
                >
                <span v-else class="text-gray-400">No Employee found</span>
              </template>
            </UInputMenu>
          </UFormGroup>

          <UFormGroup
            label="Office Location"
            name="office"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInputMenu
              v-model="officeComputed"
              :search="searchOffices"
              :loading="loadingOffices"
              placeholder="Type to search office..."
              option-attribute="label"
            >
              <template #option="{ option }">
                <span class="truncate">{{ option.label }}</span>
              </template>
              <template #empty>
                <span v-if="officeSearchQuery.length < 2" class="text-gray-400"
                  >Type at least 2 characters...</span
                >
                <span v-else class="text-gray-400">No Office found</span>
              </template>
            </UInputMenu>
          </UFormGroup>

          <UFormGroup
            v-if="divisionOptions.length > 0"
            label="Division"
            name="division"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <USelectMenu
              v-model="divisionComputed"
              :options="divisionOptions"
              option-attribute="label"
              placeholder="Select Division..."
            >
              <template #empty> No Division found </template>
            </USelectMenu>
          </UFormGroup>
        </div>

        <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
          <UFormGroup
            label="IP Address"
            name="ip_address"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInput v-model="ipAddressValue" />
          </UFormGroup>

          <UFormGroup
            label="MAC Address"
            name="mac_address"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInput v-model="macAddressValue" />
          </UFormGroup>
        </div>
        <UFormGroup label="Remarks" name="remarks">
          <UTextarea v-model="remarksComputed" autoresize />
        </UFormGroup>
      </div>

      <div
        :class="
          shouldShowInternalComponents
            ? 'grid grid-cols-2 gap-4'
            : 'grid grid-cols-1 gap-4'
        "
      >
        <!-- ? Hardware -->
        <div class="col-span-1 gap-4 flex flex-col">
          <UDivider label="Hardware" />
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Property Number"
              name="property_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="formState.property_number" />
            </UFormGroup>
            <UFormGroup
              label="Date Acquired"
              name="date_acquired"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="
                    formState.date_acquired
                      ? format(formState.date_acquired, 'yyyy/MM/dd')
                      : 'Select Date'
                  "
                  :ui="{ base: 'w-full md:w-full' }"
                  variant="outline"
                />
                <template #panel="{ close }">
                  <BaseDatePicker
                    v-model="formState.date_acquired"
                    is-required
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
          </div>
          <!-- Internal Components -->
          <!-- CHANGED: Added v-if check and removed manual error prop. UForm will now handle the errors for dynamic fields. -->
          <UFormGroup
            v-if="shouldShowInternalComponents"
            label="Internal Components"
            name="internal_components"
            class="flex flex-col"
            :required="shouldShowInternalComponents"
          >
            <div
              class="flex space-y-6 md:space-y-4 md:flex md:space-x-4 items-end"
              v-for="(row, index) in formState.internal_components"
              :key="index"
            >
              <UFormGroup
                label="Model"
                :name="`internal_components.${index}.brand_model`"
                :ui="{ wrapper: 'md:w-full' }"
                :required="shouldShowInternalComponents"
                :key="index"
              >
                <UInputMenu
                  v-model="row.brand_model"
                  :search="searchBrandModels"
                  :loading="loadingBrandModels"
                  placeholder="Type to search..."
                  option-attribute="option_attribute_description"
                  :key="index"
                >
                  <template #option="{ option }">
                    <span class="truncate">{{
                      option.option_attribute_description
                    }}</span>
                  </template>

                  <template #empty>
                    <span v-if="searchQuery.length < 2" class="text-gray-400"
                      >Type at least 2 characters...</span
                    >
                    <span v-else class="text-gray-400"
                      >No Brand Model found</span
                    >
                  </template>
                </UInputMenu>
              </UFormGroup>
              <UFormGroup
                label="Qty"
                :name="`internal_components.${index}.quantity`"
                :ui="{ wrapper: 'md:w-16' }"
                :required="shouldShowInternalComponents"
              >
                <UInput type="number" v-model="row.quantity" />
              </UFormGroup>
              <div class="flex items-end">
                <UButton
                  @click="removeRow(index)"
                  square
                  variant="outline"
                  icon="i-heroicons-x-mark"
                  color="red"
                  :disabled="index === 0"
                />
              </div>
            </div>
          </UFormGroup>
          <div v-if="shouldShowInternalComponents" class="text-center">
            <UButton
              color="orange"
              size="sm"
              icon="material-symbols:add-row-below-outline-rounded"
              @click="addRow"
            />
          </div>
        </div>
        <!-- ? Software -->
        <div
          v-if="isStandaloneMainInventory"
          class="col-span-1 gap-4 flex flex-col"
        >
          <UDivider label="Software" />
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Operating System"
              name="operating_system_name"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="operatingSystemNameComputed" />
            </UFormGroup>
            <UFormGroup
              label="OS Licence"
              name="os_license_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="osLicenseNumberComputed" />
            </UFormGroup>
          </div>
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Antivirus"
              name="anti_virus_name"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="antiVirusNameComputed" />
            </UFormGroup>
            <UFormGroup
              label="Antivirus Licence"
              name="anti_virus_license_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="antiVirusLicenseNumberComputed" />
            </UFormGroup>
          </div>
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Microsoft Office"
              name="microsoft_office_name"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="microsoftOfficeNameComputed" />
            </UFormGroup>
            <UFormGroup
              label="MS Office Licence"
              name="ms_office_license_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="msOfficeLicenseNumberComputed" />
            </UFormGroup>
          </div>
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Other Installed Applications"
              name="other_installed_applications"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UTextarea
                v-model="otherInstalledApplicationsComputed"
                autoresize
              />
            </UFormGroup>
          </div>
        </div>
      </div>

      <div
        class="space-y-6 md:space-y-0 md:flex md:space-x-6"
        v-if="isChildComponent"
      >
        <UFormGroup
          label="Parent Component"
          name="inventory"
          :ui="{ wrapper: 'md:w-full' }"
          v-if="showParentComponentField"
        >
          <UInputMenu
            v-model="inventoryComputed"
            :search="searchInventoryMainAsset"
            :loading="loadingInventories"
            placeholder="Search by property number..."
            option-attribute="property_number"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.property_number }}</span>
            </template>

            <template #empty>
              <span v-if="searchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400"
                >No Parent Component found</span
              >
            </template>
          </UInputMenu>
        </UFormGroup>

        <UFormGroup
          label="Brand Model"
          name="brand_model"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInputMenu
            v-model="brandModelComputed"
            :search="searchBrandModels"
            :loading="loadingBrandModels"
            placeholder="Type to search..."
            option-attribute="option_attribute_description"
          >
            <template #option="{ option }">
              <span class="truncate">{{
                option.option_attribute_description
              }}</span>
            </template>

            <template #empty>
              <span v-if="searchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400">No Brand Model found</span>
            </template>
          </UInputMenu>
        </UFormGroup>

        <UFormGroup
          label="Serial Number"
          name="serial_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="serialNumberValue" />
        </UFormGroup>
      </div>

      <UButton
        type="submit"
        :loading="loadingInventories"
        :disabled="!isChangedComputed"
      >
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
