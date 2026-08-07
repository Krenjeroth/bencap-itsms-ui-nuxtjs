<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash";

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

const props = defineProps<{
  pageTitle: string;
  ticket: any;
}>();

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
  event: IFormSubmitEvent<TSetTicketServiceMethodValidationSchema>,
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
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Set service method`">
    <!-- Ticket summary -->
    <div class="space-y-4 mb-4">
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
      >
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Ticket details
        </p>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Ticket number</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.ticket_number }}
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Assistance type</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.it_service?.name }}
            <span v-if="props.ticket?.it_service?.code">
              ({{ props.ticket?.it_service?.code }})
            </span>
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Current status</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.query_status_formatted }}
            · {{ props.ticket?.request_status_formatted }}
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Current service method</span>
          <span class="italic text-right break-words">
            {{
              props.ticket?.service_method_formatted ||
              props.ticket?.service_method ||
              "Not set"
            }}
          </span>
        </div>
      </div>

      <div
        class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
      >
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {{
            props.ticket?.is_other_agency
              ? "Client information"
              : "Inventory owner"
          }}
        </p>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">
            {{ props.ticket?.is_other_agency ? "Client name" : "Name" }}
          </span>
          <span class="italic text-right break-words">
            {{ props.ticket?.full_name || props.ticket?.client_name || "—" }}
          </span>
        </div>

        <div
          v-if="props.ticket?.is_other_agency"
          class="flex justify-between gap-3 text-sm"
        >
          <span class="font-medium shrink-0">Agency</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.agency?.name }}
            <span v-if="props.ticket?.agency?.abbreviation">
              ({{ props.ticket?.agency?.abbreviation }})
            </span>
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Item type</span>
          <span class="italic text-right break-words">
            {{
              props.ticket?.item_type_label ||
              props.ticket?.item_type?.type ||
              "—"
            }}
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Property number</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.property_number || "—" }}
          </span>
        </div>
      </div>
    </div>

    <UForm
      :schema="SetTicketServiceMethodValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-4"
    >
      <UFormGroup
        label="Service method"
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

      <p class="text-xs text-gray-500 dark:text-gray-400">
        Choose how this {{ props.pageTitle.toLowerCase() }} will be handled
        (e.g. on-site or pulled out). This helps logistics and reporting.
      </p>

      <UButton
        type="submit"
        variant="outline"
        color="blue"
        class="w-full justify-center mt-2"
        :ui="{ base: 'text-center' }"
        :loading="loading"
        :disabled="!isChangedComputed"
      >
        Confirm service method
      </UButton>
    </UForm>
  </BaseModal>
</template>
