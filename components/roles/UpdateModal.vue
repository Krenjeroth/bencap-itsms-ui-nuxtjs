<script setup lang="ts">
import { cloneDeep } from "lodash";
const roleStore = useRoleStore();
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
});

const originalState = ref<IUpdateRoleForm>({
  ...cloneDeep({
    title: props.role?.title || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateRoleForm)[] = ["title"];

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

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
