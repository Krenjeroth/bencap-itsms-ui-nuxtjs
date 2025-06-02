<script setup lang="ts">
const brandStore = useBrandStore();
const { loading, errorBag, hasError } = storeToRefs(brandStore);
const emit = defineEmits(["reloadTable", "success", "error", "close"]);

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

const formState = ref<ICreateBrandForm>({
  name: undefined,
});

const nameComputed = computed({
  get: () => formState.value.name,
  set: (value) => {
    formState.value.name = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateBrandValidationSchema>
) => {
  await brandStore.addBrand(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Create ${props.pageTitle}`">
    <UForm
      :schema="CreateBrandValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Brand Name" name="name" :error="errorBag.name">
        <UInput v-model="nameComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
