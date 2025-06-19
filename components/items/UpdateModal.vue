<script setup lang="ts">
import { format } from "date-fns";
import { cloneDeep } from "lodash";
const itemStore = useItemStore();
const { loading, errorBag, hasError } = storeToRefs(itemStore);

const brandModelStore = useBrandModelStore();
const { loading: loadingBrandModels, brandModelSelect } =
  storeToRefs(brandModelStore);

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  item: Object,
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

const formState = ref<IUpdateItemForm>({
  brand_model: props.item?.brand_model || undefined,
  parent_component: props.item?.parent_component || undefined,
  code: props.item?.code || undefined,
  barcode: props.item?.barcode || undefined,
  description: props.item?.description || undefined,
  serial_number: props.item?.serial_number || undefined,
  property_number: props.item?.property_number || undefined,
  ics_number: props.item?.ics_number || undefined,
  date_acquired: props.item?.date_acquired || undefined,
  ip_address: props.item?.ip_address || undefined,
  mac_address: props.item?.mac_address || undefined,
});

const originalState = ref<IUpdateItemForm>({
  ...cloneDeep({
    brand_model: props.item?.brand_model || undefined,
    parent_component: props.item?.parent_component || undefined,
    code: props.item?.code || undefined,
    barcode: props.item?.barcode || undefined,
    description: props.item?.description || undefined,
    serial_number: props.item?.serial_number || undefined,
    property_number: props.item?.property_number || undefined,
    ics_number: props.item?.ics_number || undefined,
    date_acquired: props.item?.date_acquired || undefined,
    ip_address: props.item?.ip_address || undefined,
    mac_address: props.item?.mac_address || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateItemForm)[] = [
  "brand_model",
  "parent_component",
  "code",
  "barcode",
  "description",
  "serial_number",
  "property_number",
  "ics_number",
  "date_acquired",
  "ip_address",
  "mac_address",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const parentComponentValue = computed({
  get: () => formState.value.parent_component ?? undefined,
  set: (val) => {
    formState.value.parent_component = capitalizeAll(val);
  },
});

const descriptionValue = computed({
  get: () => formState.value.description ?? undefined,
  set: (val) => {
    formState.value.description = capitalizeAll(val);
  },
});

const serialNumberValue = computed({
  get: () => formState.value.serial_number ?? undefined,
  set: (val) => {
    formState.value.serial_number = capitalizeAll(val);
  },
});

const icsNumberValue = computed({
  get: () => formState.value.ics_number ?? undefined,
  set: (val) => {
    formState.value.ics_number = capitalizeAll(val);
  },
});

const ipAddressValue = computed({
  get: () => formState.value.ip_address ?? undefined,
  set: (val) => {
    formState.value.ip_address = capitalizeAll(val);
  },
});

const macAddressValue = computed({
  get: () => formState.value.mac_address ?? undefined,
  set: (val) => {
    formState.value.mac_address = capitalizeAll(val);
  },
});

const inventoryTypeValue = computed({
  get: () => formState.value.inventory_type ?? undefined,
  set: (val) => {
    formState.value.inventory_type = capitalizeAll(val);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateItemValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await itemStore.updateItem(props.item?.id, event.data);

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
  const result = await brandModelStore.fetchBrandModelSelect(searchQuery.value);
  brandModelOptions.value = result;
  return result;
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Update ${props.pageTitle}`"
    :ui="{ width: 'md:max-w-3xl' }"
  >
    <UForm
      :schema="UpdateItemValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Brand Model"
          name="brand_model"
          :error="errorBag.brand_model"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInputMenu
            v-model="formState.brand_model"
            :search="searchBrandModels"
            :loading="loadingBrandModels"
            placeholder="Type to search..."
            option-attribute="name"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.name }}</span>
            </template>

            <template #empty>
              <span v-if="searchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400">No Brand Model found</span>
            </template>
          </UInputMenu>
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Parent Component"
          name="parent_component"
          :error="errorBag.parent_component"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="parentComponentValue" />
        </UFormGroup>

        <UFormGroup
          label="Property Number"
          name="property_number"
          :error="errorBag.property_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.property_number" />
        </UFormGroup>

        <UFormGroup
          label="ICS Number"
          name="ics_number"
          :error="errorBag.ics_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="icsNumberValue" />
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Serial Number"
          name="serial_number"
          :error="errorBag.serial_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="serialNumberValue" />
        </UFormGroup>

        <UFormGroup
          label="Inventory Type"
          name="inventory_type"
          :error="errorBag.inventory_type"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="inventoryTypeValue" />
        </UFormGroup>

        <UFormGroup
          label="Date Acquired"
          name="date_acquired"
          :error="errorBag.date_acquired"
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
        <UFormGroup
          label="IP Address"
          name="ip_address"
          :error="errorBag.ip_address"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="ipAddressValue" />
        </UFormGroup>

        <UFormGroup
          label="MAC Address"
          name="mac_address"
          :error="errorBag.mac_address"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="macAddressValue" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Description"
        name="description"
        :error="errorBag.description"
      >
        <UInput v-model="descriptionValue" />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
