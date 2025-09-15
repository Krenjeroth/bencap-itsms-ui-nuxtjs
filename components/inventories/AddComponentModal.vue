<script setup lang="ts">
import { format } from "date-fns";
import { cloneDeep } from "lodash";
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
  emit("error");
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

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateInventoryValidationSchema>
) => {
  await inventoryStore.addInventory(event.data);

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
      searchQuery.value
    );
    brandModelOptions.value = result;
    return result;
  }
  const result = await brandModelStore.fetchBrandModelSearch(
    searchQuery.value,
    itemTypeComputed.value
  );
  brandModelOptions.value = result;
  console.log(result);
  return result;
};

const employeeOptions = ref<TEmployeeSelectOption[]>([]);
const employeeSearchQuery = ref("");

const searchEmployees = async (q: string) => {
  employeeSearchQuery.value = q;
  if (!employeeSearchQuery.value || employeeSearchQuery.value.length < 2)
    return [];
  const result = await employeeStore.fetchEmployeeSearch(
    employeeSearchQuery.value
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
    inventoryMainAssetSearchQuery.value
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
    itemType.type.toLowerCase().includes(q.toLowerCase())
  );
  return filtered;
};
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

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Property Number"
          name="property_number"
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
          <!-- <UInputMenu
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
          </UInputMenu> -->
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
