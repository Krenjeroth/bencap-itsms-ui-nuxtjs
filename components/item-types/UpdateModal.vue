<script setup lang="ts">
import { cloneDeep } from "lodash";
const itemTypeStore = useItemTypeStore();
const { loading, errorBag, hasError } = storeToRefs(itemTypeStore);
const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  itemType: Object,
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

const formState = ref<IUpdateItemTypeForm>({
  type: props.itemType?.type || undefined,
  classification: props.itemType?.classification || undefined,
  purpose: props.itemType?.purpose || undefined,
  is_main_inventory: props.itemType?.is_main_inventory ? true : false,
  is_component: props.itemType?.is_component ? true : false,
});

const originalState = ref<IUpdateItemTypeForm>({
  ...cloneDeep({
    type: props.itemType?.type || undefined,
    classification: props.itemType?.classification || undefined,
    purpose: props.itemType?.purpose || undefined,
    is_main_inventory: props.itemType?.is_main_inventory ? true : false,
    is_component: props.itemType?.is_component ? true : false,
  }),
});

const fieldsToCompare: (keyof IUpdateItemTypeForm)[] = [
  "type",
  "classification",
  "purpose",
  "is_main_inventory",
  "is_component",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const typeComputed = computed({
  get: () => formState.value.type,
  set: (value) => {
    formState.value.type = capitalizeAll(value);
  },
});

const classificationComputed = computed({
  get: () => formState.value.classification,
  set: (value) => {
    formState.value.classification = capitalizeAll(value);
  },
});

const purposeComputed = computed({
  get: () => formState.value.purpose,
  set: (value) => {
    formState.value.purpose = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateItemTypeValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await itemTypeStore.updateItemType(props.itemType?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

console.log(props.itemType);
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Update ${props.pageTitle}`">
    <UForm
      :schema="UpdateItemTypeValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Type" name="type" :error="errorBag.type">
        <UInput v-model="typeComputed" />
      </UFormGroup>

      <UFormGroup
        label="Classification"
        name="classification"
        :error="errorBag.classification"
      >
        <UInput v-model="classificationComputed" />
      </UFormGroup>

      <UFormGroup label="Purpose" name="purpose" :error="errorBag.purpose">
        <UInput v-model="purposeComputed" />
      </UFormGroup>

      <div class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex">
        <UFormGroup
          name="is_main_inventory"
          :error="errorBag.is_main_inventory"
        >
          <UCheckbox
            color="primary"
            label="Main Inventory"
            v-model="formState.is_main_inventory"
          />
        </UFormGroup>

        <UFormGroup name="is_component" :error="errorBag.is_component">
          <UCheckbox
            color="primary"
            label="Component"
            v-model="formState.is_component"
          />
        </UFormGroup>
      </div>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
