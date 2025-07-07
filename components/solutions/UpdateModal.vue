<script setup lang="ts">
import { cloneDeep } from "lodash";

const solutionStore = useSolutionStore();
const { loading, errorBag, hasError } = storeToRefs(solutionStore);

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  solution: Object,
});

const { capitalizeAll, capitalizeSentences } = useStringHandler();

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

const formState = ref<IUpdateSolutionForm>({
  title: props.solution?.title || undefined,
  description: props.solution?.description || undefined,
  error_code: props.solution?.error_code || undefined,
  reference_url: props.solution?.reference_url || undefined,
});

const originalState = ref<IUpdateSolutionForm>({
  ...cloneDeep({
    title: props.solution?.title || undefined,
    description: props.solution?.description || undefined,
    error_code: props.solution?.error_code || undefined,
    reference_url: props.solution?.reference_url || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateSolutionForm)[] = [
  "title",
  "description",
  "error_code",
  "reference_url",
];

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
    formState.value.title = capitalizeSentences(value, {}, false);
  },
});

const descriptionComputed = computed({
  get: () => formState.value.description ?? undefined,
  set: (value: string | undefined) => {
    formState.value.description =
      capitalizeSentences(value, {}, false) ?? undefined;
  },
});

const errorCodeComputed = computed({
  get: () => formState.value.error_code ?? undefined,
  set: (value: string | undefined) => {
    formState.value.error_code = capitalizeAll(value) ?? undefined;
  },
});

const referenceUrlComputed = computed({
  get: () => formState.value.reference_url ?? undefined,
  set: (value: string | undefined) => {
    formState.value.reference_url = value ?? undefined;
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateSolutionValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  const form = {
    ...event.data,
    description_original_state: originalState.value.description,
  };

  await solutionStore.updateSolution(props.solution?.id, form);

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
      :schema="UpdateSolutionValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between md:grid-cols-3"
      >
        <UFormGroup
          label="Title"
          name="title"
          :error="errorBag.title"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="titleComputed" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Description"
        name="description"
        :error="errorBag.description"
      >
        <UTextarea v-model="descriptionComputed" autoresize />
      </UFormGroup>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between md:grid-cols-3"
      >
        <UFormGroup
          label="Error Code (Optional)"
          name="error_code"
          :error="errorBag.error_code"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="errorCodeComputed" />
        </UFormGroup>

        <UFormGroup
          label="Reference URL (Optional)"
          name="reference_url"
          :error="errorBag.reference_url"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="referenceUrlComputed" />
        </UFormGroup>
      </div>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
