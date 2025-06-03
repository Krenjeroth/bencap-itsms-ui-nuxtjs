<script setup lang="ts">
const brandModelStore = useBrandModelStore();
const { loading, errorBag, hasError } = storeToRefs(brandModelStore);
const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const brandStore = useBrandStore();
const { loading: loadingBrands, brandSelect } = storeToRefs(brandStore);
brandStore.fetchBrandSelect();

const props = defineProps({
  pageTitle: String,
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

const formState = ref<ICreateBrandModelForm>({
  name: undefined,
  brand: undefined,
  year_released: undefined,
});

const nameComputed = computed({
  get: () => formState.value.name,
  set: (value) => {
    formState.value.name = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateBrandModelValidationSchema>
) => {
  await brandModelStore.addBrandModel(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
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
      :schema="CreateBrandModelValidationSchema"
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

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
