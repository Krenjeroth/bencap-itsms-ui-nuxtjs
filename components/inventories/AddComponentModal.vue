<script setup lang="ts">
import { format } from "date-fns";
const toast = useToast();
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
  const message =
    errorBag.value?.property_number ??
    errorBag.value?.general ??
    "Something went wrong. Please check the form and try again.";

  toast.add({
    title: "Unable to add component",
    description: message,
    color: "red",
  });

  // emit("error");
};

const onNoDataChange = () => {
  emit("noDataChange");
};

const formState = reactive<IAddComponentInventoryForm>({
  item_type: props.inventoryItem?.item_type?.id || undefined,
  brand_model: props.inventoryItem?.brand_model || undefined,

  parent_property_number: props.inventoryItem?.property_number || undefined,
  property_number: `${props.inventoryItem?.property_number}-` || undefined,
  date_acquired: props.inventoryItem?.date_acquired
    ? transformDbDate(props.inventoryItem.date_acquired)
    : undefined,
  serial_number: props.inventoryItem?.serial_number || undefined,
  status: props.inventoryItem?.status || undefined,
  parent_id: props.inventoryItem?.id || undefined,

  inventory: props.inventoryItem?.id || undefined, // Parent Component
});

const serialNumberValue = computed({
  get: () => formState.serial_number ?? undefined,
  set: (val) => {
    formState.serial_number = val;
  },
});

const propertyNumberComputed = computed({
  get: () => `${formState.property_number}`,
  set: (val) => {
    formState.property_number = `${val}`;
  },
});

const parentPropertyNumberComputed = computed({
  get: () => formState.parent_property_number ?? undefined,
  set: (val) => {
    formState.parent_property_number = `${val}`;
  },
});

const itemTypeComputed = computed({
  get: () => formState.item_type ?? undefined,
  set: (value) => {
    formState.item_type = value ? Number(value) : undefined;
  },
});

const brandModelComputed = computed({
  get: () => formState.brand_model ?? undefined,
  set: (value) => {
    formState.brand_model = value ? value : undefined;
  },
});

const componentItemTypeOptions = computed(() =>
  itemTypeSelect.value.filter((itemType: any) => itemType.is_component),
);

const handleSubmit = async (
  event: IFormSubmitEvent<TAddComponentValidationSchema>,
) => {
  const payload: TStoreInventoryPayload = {
    employee_id: null,
    // ✅ Inherit office directly from the parent item, no picker needed
    office_id: props.inventoryItem?.office_id ?? null,
    office_code: props.inventoryItem?.office_code ?? null,
    office_name: props.inventoryItem?.office_name ?? null,
    division_id: props.inventoryItem?.division_id ?? null,
    division_name: props.inventoryItem?.division_name ?? null,

    item_type_id: formState.item_type ?? null,
    brand_model_id: formState.brand_model?.id ?? null,
    parent_component_id: formState.inventory
      ? Number(formState.inventory)
      : null,

    ip_address: null,
    mac_address: null,
    remarks: null,

    operating_system_name: null,
    os_license_number: null,
    anti_virus_name: null,
    anti_virus_license_number: null,
    microsoft_office_name: null,
    ms_office_license_number: null,
    other_installed_applications: null,

    property_number: formState.property_number ?? "",
    date_acquired: formState.date_acquired ?? null,
    warranty_expiration_date: null,
    serial_number: formState.serial_number ?? null,
    status: formState.status ?? "active",

    internal_components: [],
  };

  await inventoryStore.addInventory(payload);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const brandModelOptions = ref<TBrandModelSelectOption[]>([]);
const searchQuery = ref("");

const searchBrandModels = async (q: string) => {
  searchQuery.value = q;
  if (!searchQuery.value || searchQuery.value.length < 2) return [];
  if (itemTypeComputed.value === 1) {
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

const searchEmployees = async (q: string) => {
  employeeSearchQuery.value = q;
  if (!employeeSearchQuery.value || employeeSearchQuery.value.length < 2)
    return [];
  const result = await employeeStore.fetchEmployeeSearch(
    employeeSearchQuery.value,
  );
  employeeOptions.value = result;
  return result;
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
  return componentItemTypeOptions.value.filter((itemType: any) =>
    itemType.type.toLowerCase().includes(q.toLowerCase()),
  );
};

watch(
  () => formState.property_number,
  () => {
    if (errorBag.value?.property_number) {
      delete errorBag.value.property_number;
    }
  },
);
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Add Component to ${props.inventoryItem?.property_number}`"
    :ui="{ width: 'md:max-w-7xl' }"
  >
    <UForm
      :schema="AddComponentValidationSchema"
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
            :options="componentItemTypeOptions"
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

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Property Number"
          name="property_number"
          :error="errorBag?.property_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="propertyNumberComputed" />
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

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup label="Parent Component" :ui="{ wrapper: 'md:w-full' }">
          <UInput v-model="parentPropertyNumberComputed" disabled />
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

      <UButton type="submit" :loading="loadingInventories"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
