<script setup lang="ts">
import { cloneDeep } from "lodash";
const brandStore = useBrandStore();
const { loading, errorBag, hasError } = storeToRefs(brandStore);
const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  brand: Object,
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

const formState = ref<IUpdateBrandForm>({
  name: props.brand?.name || undefined,
});

const originalState = ref<IUpdateBrandForm>({
  ...cloneDeep({
    name: props.brand?.name || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateBrandForm)[] = ["name"];

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

  await brandStore.updateBrand(props.brand?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Update ${props.pageTitle}`">
    <UForm
      :schema="CreateBrandValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Brand Name" name="name" :error="errorBag.name">
        <UInput v-model="nameComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
