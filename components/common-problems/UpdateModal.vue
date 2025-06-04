<script setup lang="ts">
import { cloneDeep } from "lodash";
const commonProblemStore = useCommonProblemStore();
const { loading, errorBag, hasError } = storeToRefs(commonProblemStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  commonProblem: Object,
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

const formState = ref<IUpdateCommonProblemForm>({
  code: props.commonProblem?.code || undefined,
  general_term: props.commonProblem?.general_term || undefined,
  information: props.commonProblem?.information || undefined,
  item_type: props.commonProblem?.item_type?.id || undefined,
});

const originalState = ref<IUpdateCommonProblemForm>({
  ...cloneDeep({
    code: props.commonProblem?.code || undefined,
    general_term: props.commonProblem?.general_term || undefined,
    information: props.commonProblem?.information || undefined,
    item_type: props.commonProblem?.item_type?.id || undefined,
  }),
});

const fieldsToCompare: (keyof IUpdateCommonProblemForm)[] = [
  "code",
  "general_term",
  "information",
  "item_type",
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
  event: IFormSubmitEvent<TUpdateCommonProblemValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await commonProblemStore.updateCommonProblem(
    props.commonProblem?.id,
    event.data
  );

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }
  return itemTypeSelect.value.filter((itemType) =>
    itemType.type.toLowerCase().includes(q.toLowerCase())
  );
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Update ${props.pageTitle}`">
    <UForm
      :schema="UpdateCommonProblemValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Code" name="code" :error="errorBag.code">
        <UInput v-model="codeComputed" />
      </UFormGroup>

      <UFormGroup
        label="General Term"
        name="general_term"
        :error="errorBag.general_term"
      >
        <UInput v-model="formState.general_term" />
      </UFormGroup>

      <UFormGroup
        label="Department"
        name="item_type"
        :error="errorBag.item_type"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <USelectMenu
          v-model="formState.item_type"
          :options="itemTypeSelect"
          :searchable="true"
          :search="searchItemTypes"
          :loading="loadingItemTypes"
          placeholder="Type to search..."
          value-attribute="id"
          option-attribute="type"
        >
          <template #option-empty="{ query }">
            <q>{{ query }}</q> not found
          </template>

          <template #empty> No Item Type found </template>
        </USelectMenu>
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
