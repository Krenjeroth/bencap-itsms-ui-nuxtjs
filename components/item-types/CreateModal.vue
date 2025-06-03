<script setup lang="ts">
const itemTypeStore = useItemTypeStore();
const { loading, errorBag, hasError } = storeToRefs(itemTypeStore);
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

const formState = ref<ICreateItemTypeForm>({
  type: undefined,
  classification: undefined,
  purpose: undefined,
});

const typeComputed = computed({
  get: () => formState.value.type,
  set: (value) => {
    formState.value.type = capitalizeAll(value);
  },
});

const classificationComputed = computed({
  get: () => formState.value.classification,
  set: (value) => {
    formState.value.classification = capitalizeAll(value);
  },
});

const purposeComputed = computed({
  get: () => formState.value.purpose,
  set: (value) => {
    formState.value.purpose = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateItemTypeValidationSchema>
) => {
  await itemTypeStore.addItemType(event.data);

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
      :schema="CreateItemTypeValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Type" name="type" :error="errorBag.type">
        <UInput v-model="typeComputed" />
      </UFormGroup>

      <UFormGroup
        label="Classification"
        name="classification"
        :error="errorBag.classification"
      >
        <UInput v-model="classificationComputed" />
      </UFormGroup>

      <UFormGroup label="Purpose" name="purpose" :error="errorBag.purpose">
        <UInput v-model="purposeComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
