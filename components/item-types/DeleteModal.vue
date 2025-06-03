<script setup lang="ts">
const itemTypeStore = useItemTypeStore();

const { loading, hasError } = storeToRefs(itemTypeStore);
const props = defineProps({
  itemType: Object,
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
  await itemTypeStore.deleteItemType(props.itemType?.id);

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
    :title="`Delete ${props.itemType?.type}`"
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
