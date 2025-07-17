<script setup lang="ts">
const measurementUnitStore = useMeasurementUnitStore();
const { loading, errorBag, hasError } = storeToRefs(measurementUnitStore);
const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const props = defineProps({
  pageTitle: String,
});

const { capitalizeSentences, lowerCaseAll } = useStringHandler();

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreateMeasurementUnitForm>({
  name: undefined,
  abbreviation: undefined,
  description: undefined,
});

const nameComputed = computed({
  get: () => formState.value.name,
  set: (value) => {
    formState.value.name = capitalizeSentences(value);
  },
});

const abbreviationComputed = computed({
  get: () => formState.value.abbreviation,
  set: (value) => {
    formState.value.abbreviation = lowerCaseAll(value);
  },
});

const descriptionComputed = computed({
  get: () => formState.value.description ?? undefined,
  set: (value: string | undefined) => {
    formState.value.description =
      capitalizeSentences(value, {}, false) ?? undefined;
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateMeasurementUnitValidationSchema>
) => {
  await measurementUnitStore.addMeasurementUnit(event.data);

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
      :schema="CreateMeasurementUnitValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Measurement Unit" name="name" :error="errorBag.name">
        <UInput v-model="nameComputed" />
      </UFormGroup>

      <UFormGroup
        label="Abbreviation"
        name="abbreviation"
        :error="errorBag.abbreviation"
      >
        <UInput v-model="abbreviationComputed" />
      </UFormGroup>

      <UFormGroup
        label="Description (Optional)"
        name="description"
        :error="errorBag.description"
      >
        <UTextarea v-model="descriptionComputed" autoresize />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
