<script setup lang="ts">
import { cloneDeep } from "lodash";
const departmentStore = useDepartmentStore();
const { loading, errorBag, hasError } = storeToRefs(departmentStore);
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
  department: Object,
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

const formState = ref<IUpdateDepartmentForm>({
  name: props.department?.name || undefined,
  full_name: props.department?.full_name || undefined,
  division: props.department?.division || undefined,
  abbreviation: props.department?.abbreviation || undefined,
});

const originalState = ref<IUpdateDepartmentForm>({
  ...cloneDeep({
    name: props.department?.name || undefined,
    full_name: props.department?.full_name || undefined,
    division: props.department?.division || undefined,
    abbreviation: props.department?.abbreviation || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateDepartmentForm)[] = [
  "name",
  "full_name",
  "division",
  "abbreviation",
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
  event: IFormSubmitEvent<TUpdateDepartmentValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await departmentStore.updateDepartment(props.department?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Update Department'">
    <UForm
      :schema="UpdateDepartmentValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Department Name" name="name" :error="errorBag.name">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup
        label="Department Full Name"
        name="full_name"
        :error="errorBag.full_name"
      >
        <UInput v-model="formState.full_name" />
      </UFormGroup>

      <UFormGroup label="Division" name="division" :error="errorBag.division">
        <UInput v-model="formState.division" />
      </UFormGroup>

      <UFormGroup
        label="Abbreviation"
        name="abbreviation"
        :error="errorBag.abbreviation"
      >
        <UInput v-model="abbreviationComputed" />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
