<script setup lang="ts">
import { cloneDeep } from "lodash";
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, serviceMethodOptions } =
  storeToRefs(ticketStore);

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  ticket: Object,
});

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

const formState = ref<ISetTicketServiceMethodForm>({
  service_method: props.ticket?.service_method || "on_site",
});

const originalState = ref<ISetTicketServiceMethodForm>({
  ...cloneDeep({
    service_method: props.ticket?.service_method || "on_site",
  }),
});

const fieldsToCompare: (keyof ISetTicketServiceMethodForm)[] = [
  "service_method",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const serviceMethodComputed = computed({
  get: () => formState.value.service_method ?? undefined,
  set: (value) => (formState.value.service_method = value || undefined),
});

const handleSubmit = async (
  event: IFormSubmitEvent<TSetTicketServiceMethodValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }
  await ticketStore.setTicketServiceMethod(props.ticket?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Set Service Method`">
    <UForm
      :schema="SetTicketServiceMethodValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup
        label="Service Method"
        name="service_method"
        :error="errorBag.service_method"
      >
        <USelect
          v-model="serviceMethodComputed"
          :options="serviceMethodOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Select"
        />
      </UFormGroup>

      <UButton
        type="submit"
        variant="outline"
        color="blue"
        class="w-full justify-center mt-4"
        :ui="{ base: 'text-center' }"
        :loading="loading"
        :disabled="!isChangedComputed"
      >
        Set Service Method
      </UButton>
    </UForm>
  </BaseModal>
</template>
