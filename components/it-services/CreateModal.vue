<script setup lang="ts">
const itServiceStore = useItServiceStore();
const { loading, errorBag, hasError } = storeToRefs(itServiceStore);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const props = defineProps({
  pageTitle: String,
});

const { capitalizeAll, capitalizeSentences } = useStringHandler();

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreateItServiceForm>({
  name: undefined,
  code: undefined,
  description: undefined,
});

const codeComputed = computed({
  get: () => formState.value.code,
  set: (value) => {
    formState.value.code = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateItServiceValidationSchema>
) => {
  console.log(event.data);
  await itServiceStore.addItService(event.data);

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
      :schema="CreateItServiceValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Name" name="name" :error="errorBag.name">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup
        label="Description"
        name="description"
        :error="errorBag.description"
      >
        <UInput v-model="formState.description" />
      </UFormGroup>

      <UFormGroup label="Code" name="code" :error="errorBag.code">
        <UInput v-model="codeComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
