<script setup lang="ts">
const departmentStore = useDepartmentStore();
const { loading, errorBag, hasError } = storeToRefs(departmentStore);
const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreateDepartmentForm>({
  name: undefined,
  full_name: undefined,
  division: undefined,
  abbreviation: undefined,
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateDepartmentValidationSchema>
) => {
  await departmentStore.addDepartment(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Create Department'">
    <UForm
      :schema="CreateDepartmentValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Department Name" name="name" :error="errorBag.name">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup
        label="Department Full Name"
        name="full_name"
        :error="errorBag.full_name"
      >
        <UInput v-model="formState.full_name" />
      </UFormGroup>

      <UFormGroup label="Division" name="division" :error="errorBag.division">
        <UInput v-model="formState.division" />
      </UFormGroup>

      <UFormGroup
        label="Abbreviation"
        name="abbreviation"
        :error="errorBag.abbreviation"
      >
        <UInput v-model="formState.abbreviation" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
