<script setup lang="ts">
const inventoryStore = useInventoryStore();

const { loading, hasError } = storeToRefs(inventoryStore);
const props = defineProps({
  inventoryItem: Object,
  pageTitle: String,
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
  await inventoryStore.deleteInventory(props.inventoryItem?.id);

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
    :title="`Delete ${props.inventoryItem?.property_number}`"
    :ui="{ width: 'md:max-w-1xl' }"
  >
    <p class="italic">This action cannot be undone.</p>
    <p class="italic">
      All data associated with this {{ props.pageTitle }} will be deleted.
    </p>
    <UButton
      variant="solid"
      color="red"
      class="w-full justify-center mt-4"
      :ui="{ base: 'text-center' }"
      @click="handleSubmit"
      :loading="loading"
    >
      Delete this {{ props.pageTitle }}
    </UButton>
  </BaseModal>
</template>
