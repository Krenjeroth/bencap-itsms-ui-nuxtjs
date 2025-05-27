<script setup lang="ts">
const permissionStore = usePermissionStore();

const { loading, hasError } = storeToRefs(permissionStore);
const props = defineProps({
  permission: Object,
});
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

const handleSubmit = async () => {
  await permissionStore.deletePermission(props.permission?.id);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Delete ${props.permission?.title}`"
    :ui="{ width: 'md:max-w-1xl' }"
  >
    <p class="italic">This action cannot be undone.</p>
    <p class="italic">
      All data associated with this permission will be deleted.
    </p>
    <UButton
      variant="solid"
      color="red"
      class="w-full justify-center mt-4"
      :ui="{ base: 'text-center' }"
      @click="handleSubmit"
      :loading="loading"
    >
      Delete this permission
    </UButton>
  </BaseModal>
</template>
