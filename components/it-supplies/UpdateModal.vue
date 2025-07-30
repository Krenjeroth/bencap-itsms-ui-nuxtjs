<script setup lang="ts">
import { cloneDeep } from "lodash";
const itSupplyStore = useItSupplyStore();
const {
  loading: loadingItSupplies,
  errorBag,
  hasError,
} = storeToRefs(itSupplyStore);

const brandModelStore = useBrandModelStore();
const { loading: loadingBrandModels, brandModelSelect } =
  storeToRefs(brandModelStore);

const measurementUnitStore = useMeasurementUnitStore();
const { loading: loadingMeasurementUnits, measurementUnitSelect } =
  storeToRefs(measurementUnitStore);
measurementUnitStore.fetchMeasurementUnitSelect();

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

const formState = ref<IUpdateItSupplyForm>({
  brand_model: props.item?.brand_model || undefined,
  measurement_unit: props.item?.measurement_unit.id || undefined,
  description: props.item?.description || undefined,
  item_number: props.item?.item_number || undefined,
  stock_number: props.item?.stock_number || undefined,
  quantity: props.item?.quantity || undefined,
});

const originalState = ref<IUpdateItSupplyForm>({
  ...cloneDeep({
    brand_model: props.item?.brand_model || undefined,
    measurement_unit: props.item?.measurement_unit.id || undefined,
    description: props.item?.description || undefined,
    item_number: props.item?.item_number || undefined,
    stock_number: props.item?.stock_number || undefined,
    quantity: props.item?.quantity || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateItSupplyForm)[] = [
  "brand_model",
  "measurement_unit",
  "description",
  "item_number",
  "stock_number",
  "quantity",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const descriptionComputed = computed({
  get: () => formState.value.description ?? undefined,
  set: (value) => {
    formState.value.description = capitalizeAll(value);
  },
});

const itemNumberComputed = computed({
  get: () => formState.value.item_number ?? undefined,
  set: (value) => {
    formState.value.item_number = capitalizeAll(value);
  },
});

const stockNumberComputed = computed({
  get: () => formState.value.stock_number ?? undefined,
  set: (value) => {
    formState.value.stock_number = capitalizeAll(value);
  },
});

const quantityComputed = computed({
  get: () => formState.value.quantity,
  set: (value) => {
    formState.value.quantity = value;
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateItSupplyValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await itSupplyStore.updateItSupply(props.item?.id, event.data);

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
    :ui="{ width: 'md:max-w-4xl' }"
  >
    <UForm
      :schema="UpdateItSupplyValidationSchema"
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

        <UFormGroup
          label="Measurement Unit"
          name="measurement_unit"
          :error="errorBag.measurement_unit"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelect
            v-model="formState.measurement_unit"
            :options="measurementUnitSelect"
            value-attribute="id"
            option-attribute="name"
            placeholder="Select"
          />
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Item Number"
          name="item_number"
          :error="errorBag.item_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="itemNumberComputed" />
        </UFormGroup>

        <UFormGroup
          label="Stock Number"
          name="stock_number"
          :error="errorBag.stock_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="stockNumberComputed" />
        </UFormGroup>

        <UFormGroup
          label="Quantity"
          name="quantity"
          :error="errorBag.quantity"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput
            type="number"
            :min="1"
            :max="10000"
            v-model="quantityComputed"
          />
        </UFormGroup>
      </div>

      <!-- <UFormGroup
        label="Description"
        name="description"
        :error="errorBag.description"
      >
        <UTextarea v-model="descriptionComputed" autoresize />
      </UFormGroup> -->

      <UButton
        type="submit"
        :loading="loadingItSupplies"
        :disabled="!isChangedComputed"
      >
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
