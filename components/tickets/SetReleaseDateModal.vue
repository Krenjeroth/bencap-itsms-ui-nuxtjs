<script setup lang="ts">
import { cloneDeep } from "lodash";
import { format } from "date-fns";
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, serviceMethodOptions } =
  storeToRefs(ticketStore);

const { transformDbDate } = useDateHandler();

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

const formState = ref<ISetTicketReleaseDateForm>({
  released_at: props.ticket?.released_at
    ? transformDbDate(props.ticket.released_at)
    : undefined,
});
console.log(typeof formState.value.released_at);

const originalState = ref<ISetTicketReleaseDateForm>({
  ...cloneDeep({
    released_at: props.ticket?.released_at
      ? transformDbDate(props.ticket.released_at)
      : undefined,
  }),
});

const fieldsToCompare: (keyof ISetTicketReleaseDateForm)[] = ["released_at"];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const releasedAtComputed = computed({
  get: () => formState.value.released_at ?? undefined,
  set: (value) => (formState.value.released_at = value || undefined),
});

const handleSubmit = async (
  event: IFormSubmitEvent<TSetTicketReleaseDateValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await ticketStore.setTicketReleaseDate(props.ticket?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Set Release Date`">
    <UForm
      :schema="SetTicketReleaseDateValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup
        label="Release Date"
        name="released_at"
        :error="errorBag.released_at"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="
              formState.released_at
                ? format(formState.released_at, 'yyyy/MM/dd')
                : 'Select Date'
            "
            :ui="{ base: 'w-full md:w-full' }"
            variant="outline"
          />

          <template #panel="{ close }">
            <BaseDatePicker
              v-model="formState.released_at"
              is-required
              @close="close"
            />
          </template>
        </UPopover>
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
        Set Release Date
      </UButton>
    </UForm>
  </BaseModal>
</template>
