<script setup lang="ts">
import { cloneDeep } from "lodash";
const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const { permissionsAll } = storeToRefs(permissionStore);
permissionStore.fetchPermissionsAll();
const { loading, errorBag, hasError } = storeToRefs(roleStore);
const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const onClose = () => emit("close");

const props = defineProps({
  role: Object,
});

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

const formState = ref<IUpdateRoleForm>({
  title: props.role?.title || undefined,
  permission_ids: props.role?.permissions.map((p: any) => p.id) || [],
});

const originalState = ref<IUpdateRoleForm>({
  ...cloneDeep({
    title: props.role?.title || undefined,
    permission_ids: props.role?.permissions.map((p: any) => p.id) || [],
  }),
});

const fieldsToCompare: (keyof IUpdateRoleForm)[] = ["title", "permission_ids"];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateRoleValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  console.log(event.data);

  await roleStore.updateRole(props.role?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Update Role'">
    <UForm
      :schema="UpdateRoleValidationSchema"
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

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
