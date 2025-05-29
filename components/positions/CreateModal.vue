<script setup lang="ts">
const positionStore = usePositionStore();
const { loading, errorBag, hasError } = storeToRefs(positionStore);
const emit = defineEmits(["reloadTable", "success", "error", "close"]);

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

const formState = ref<ICreatePositionForm>({
  name: undefined,
  abbreviation: undefined,
  salary_grade: undefined,
});

const nameComputed = computed({
  get: () => formState.value.name,
  set: (value) => {
    formState.value.name = capitalizeAll(value);
  },
});

const abbreviationComputed = computed({
  get: () => formState.value.abbreviation,
  set: (value) => {
    formState.value.abbreviation = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreatePositionValidationSchema>
) => {
  await positionStore.addPosition(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Create Position'">
    <UForm
      :schema="CreatePositionValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Position Name" name="name" :error="errorBag.name">
        <UInput v-model="nameComputed" />
      </UFormGroup>

      <UFormGroup
        label="Abbreviation"
        name="abbreviation"
        :error="errorBag.abbreviation"
      >
        <UInput v-model="abbreviationComputed" />
      </UFormGroup>

      <UFormGroup
        label="Salary Grade"
        name="salary_grade"
        :error="errorBag.salary_grade"
      >
        <UInput v-model="formState.salary_grade" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
