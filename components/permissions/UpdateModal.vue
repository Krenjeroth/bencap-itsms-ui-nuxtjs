<script setup lang="ts">
import { cloneDeep } from "lodash";
const permissionStore = usePermissionStore();
const { loading, errorBag, hasError } = storeToRefs(permissionStore);
const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const { strSanitize } = useStringHandler();

const onClose = () => emit("close");

const props = defineProps({
  permission: Object,
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

const formState = ref<IUpdatePermissionForm>({
  title: props.permission?.title || undefined,
});

const originalState = ref<IUpdatePermissionForm>({
  ...cloneDeep({
    title: props.permission?.title || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdatePermissionForm)[] = ["title"];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const titleComputed = computed({
  get: () => formState.value.title,
  set: (value) => {
    formState.value.title = strSanitize(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdatePermissionValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await permissionStore.updatePermission(props.permission?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Update Permission'">
    <UForm
      :schema="UpdatePermissionValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Permission Title" name="title" :error="errorBag.title">
        <UInput v-model="titleComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
