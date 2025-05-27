<script setup lang="ts">
const roleStore = useRoleStore();
const { loading, errorBag, hasError } = storeToRefs(roleStore);
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

const formState = ref<ICreateRoleForm>({
  title: undefined,
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateRoleValidationSchema>
) => {
  await roleStore.addRole(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Create Role'">
    <UForm
      :schema="CreateRoleValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Role Title" name="title" :error="errorBag.title">
        <UInput v-model="formState.title" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
