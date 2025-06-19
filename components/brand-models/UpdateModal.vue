<script setup lang="ts">
import { cloneDeep } from "lodash";
const brandModelStore = useBrandModelStore();
const { loading, errorBag, hasError } = storeToRefs(brandModelStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const brandStore = useBrandStore();
const { loading: loadingBrands, brandSelect } = storeToRefs(brandStore);
brandStore.fetchBrandSelect();

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  brandModel: Object,
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

const formState = ref<IUpdateBrandModelForm>({
  name: props.brandModel?.name || undefined,
  item_type: props.brandModel?.item_type.id || undefined,
  brand: props.brandModel?.brand.id || undefined,
  year_released: props.brandModel?.year_released || undefined,
});

const originalState = ref<IUpdateBrandModelForm>({
  ...cloneDeep({
    name: props.brandModel?.name || undefined,
    item_type: props.brandModel?.item_type.id || undefined,
    brand: props.brandModel?.brand.id || undefined,
    year_released: props.brandModel?.year_released || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateBrandModelForm)[] = [
  "name",
  "item_type",
  "brand",
  "year_released",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const nameComputed = computed({
  get: () => formState.value.name,
  set: (value) => {
    formState.value.name = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateBrandValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await brandModelStore.updateBrandModel(props.brandModel?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }
  return itemTypeSelect.value.filter((itemType) =>
    itemType.type.toLowerCase().includes(q.toLowerCase())
  );
};

const searchBrands = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (brandSelect.value.length === 0) {
    await brandStore.fetchBrandSelect();
  }
  return brandSelect.value.filter((brand) =>
    brand.name.toLowerCase().includes(q.toLowerCase())
  );
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Create ${props.pageTitle}`">
    <UForm
      :schema="UpdateBrandModelValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between md:grid-cols-3"
      >
        <UFormGroup
          label="Model Name"
          name="name"
          :error="errorBag.name"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="nameComputed" />
        </UFormGroup>

        <UFormGroup
          label="Year Released"
          name="year_released"
          :error="errorBag.year_released"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.year_released" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Item Type"
        name="item_type"
        :error="errorBag.item_type"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <USelectMenu
          v-model="formState.item_type"
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

      <UFormGroup
        label="Brand"
        name="brand"
        :error="errorBag.brand"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <USelectMenu
          v-model="formState.brand"
          :options="brandSelect"
          :searchable="true"
          :search="searchBrands"
          :loading="loadingBrands"
          placeholder="Type to search..."
          value-attribute="id"
          option-attribute="name"
        >
          <template #option-empty="{ query }">
            <q>{{ query }}</q> not found
          </template>

          <template #empty> No {{ props.pageTitle }} found </template>
        </USelectMenu>
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
