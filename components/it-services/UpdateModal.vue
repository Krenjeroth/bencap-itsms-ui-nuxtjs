<script setup lang="ts">
import { cloneDeep } from "lodash";
const itServiceStore = useItServiceStore();
const { loading, errorBag, hasError } = storeToRefs(itServiceStore);

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  itService: Object,
});

const { capitalizeAll } = useStringHandler();

const onClose = () => emit("close");

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

const formState = ref<IUpdateItServiceForm>({
  name: props.itService?.name || undefined,
  code: props.itService?.code || undefined,
  description: props.itService?.description || undefined,
});

const originalState = ref<IUpdateItServiceForm>({
  ...cloneDeep({
    name: props.itService?.name || undefined,
    code: props.itService?.code || undefined,
    description: props.itService?.description || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateItServiceForm)[] = [
  "code",
  "name",
  "description",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const codeComputed = computed({
  get: () => formState.value.code,
  set: (value) => {
    formState.value.code = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateItServiceValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await itServiceStore.updateItService(props.itService?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Update ${props.pageTitle}`">
    <UForm
      :schema="UpdateItServiceValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Name" name="name" :error="errorBag.name">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup
        label="Description"
        name="description"
        :error="errorBag.description"
      >
        <UInput v-model="formState.description" />
      </UFormGroup>

      <UFormGroup label="Code" name="code" :error="errorBag.code">
        <UInput v-model="codeComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
