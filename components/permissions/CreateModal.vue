<script setup lang="ts">
const permissionStore = usePermissionStore();
const { loading, errorBag, hasError } = storeToRefs(permissionStore);
const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const { strSanitize } = useStringHandler();

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreatePermissionForm>({
  title: undefined,
});

const titleComputed = computed({
  get: () => formState.value.title,
  set: (value) => {
    formState.value.title = strSanitize(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreatePermissionValidationSchema>
) => {
  await permissionStore.addPermission(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Create Permission'">
    <UForm
      :schema="CreatePermissionValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Permission Title" name="title" :error="errorBag.title">
        <UInput v-model="titleComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
