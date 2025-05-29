<script setup lang="ts">
import { cloneDeep } from "lodash";
const positionStore = usePositionStore();
const { loading, errorBag, hasError } = storeToRefs(positionStore);
const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const { capitalizeAll } = useStringHandler();

const onClose = () => emit("close");

const props = defineProps({
  position: Object,
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

const formState = ref<IUpdatePositionForm>({
  name: props.position?.name || undefined,
  abbreviation: props.position?.abbreviation || undefined,
  salary_grade: props.position?.salary_grade || undefined,
});

const originalState = ref<IUpdatePositionForm>({
  ...cloneDeep({
    name: props.position?.name || undefined,
    abbreviation: props.position?.abbreviation || undefined,
    salary_grade: props.position?.salary_grade || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdatePositionForm)[] = [
  "name",
  "abbreviation",
  "salary_grade",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const abbreviationComputed = computed({
  get: () => formState.value.abbreviation,
  set: (value) => {
    formState.value.abbreviation = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdatePositionValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await positionStore.updatePosition(props.position?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Update Position'">
    <UForm
      :schema="UpdatePositionValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Position Name" name="name" :error="errorBag.name">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup
        label="Abbreviation"
        name="abbreviation"
        :error="errorBag.abbreviation"
      >
        <UInput v-model="abbreviationComputed" />
      </UFormGroup>

      <UFormGroup
        label="Salary Grade"
        name="salary_grade"
        :error="errorBag.salary_grade"
      >
        <UInput v-model="formState.salary_grade" />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
