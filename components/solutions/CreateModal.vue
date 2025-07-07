<script setup lang="ts">
const { user } = useSanctumAuth<IUser>();
const solutionStore = useSolutionStore();
const { loading, errorBag, hasError } = storeToRefs(solutionStore);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const props = defineProps({
  pageTitle: String,
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

const formState = ref<ICreateSolutionForm>({
  title: undefined,
  description: undefined,
  error_code: undefined,
  reference_url: undefined,
  author_id: undefined,
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
  event: IFormSubmitEvent<TCreateSolutionValidationSchema>
) => {
  const form = {
    ...event.data,
    author_id: user.value?.profile.id,
  };

  await solutionStore.addSolution(form);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Create ${props.pageTitle}`">
    <UForm
      :schema="CreateSolutionValidationSchema"
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

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
