<script setup lang="ts">
import { cloneDeep } from "lodash";
const measurementUnitStore = useMeasurementUnitStore();
const { loading, errorBag, hasError } = storeToRefs(measurementUnitStore);
const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  measurementUnit: Object,
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

const onNoDataChange = () => {
  emit("noDataChange");
};

const formState = ref<IUpdateMeasurementUnitForm>({
  name: props.measurementUnit?.name || undefined,
  abbreviation: props.measurementUnit?.abbreviation || undefined,
  description: props.measurementUnit?.description || undefined,
});

const originalState = ref<IUpdateMeasurementUnitForm>({
  ...cloneDeep({
    name: props.measurementUnit?.name || undefined,
    abbreviation: props.measurementUnit?.abbreviation || undefined,
    description: props.measurementUnit?.description || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateMeasurementUnitForm)[] = [
  "name",
  "abbreviation",
  "description",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
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
  event: IFormSubmitEvent<TUpdateMeasurementUnitValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await measurementUnitStore.updateMeasurementUnit(
    props.measurementUnit?.id,
    event.data
  );

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
      :schema="UpdateMeasurementUnitValidationSchema"
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

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
