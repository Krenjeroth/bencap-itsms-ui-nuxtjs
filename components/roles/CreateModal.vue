<script setup lang="ts">
const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const { permissionsAll } = storeToRefs(permissionStore);
permissionStore.fetchPermissionsAll();
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
  permission_ids: [],
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

      <UFormGroup
        label="Permissions"
        name="permission_ids"
        :error="errorBag.permission_ids"
      >
        <div class="grid grid-cols-2 gap-1">
          <UCheckbox
            v-for="permission in permissionsAll"
            :key="permission.id"
            v-model="formState.permission_ids"
            :value="permission.id"
            :id="permission.title"
            :label="permission.title"
          />
        </div>
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
