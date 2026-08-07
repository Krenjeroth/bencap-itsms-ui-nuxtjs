<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash";
import { format } from "date-fns";

const ticketStore = useTicketStore();
const { loading, errorBag, hasError } = storeToRefs(ticketStore);

const { transformDbDate } = useDateHandler();

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

const formState = ref<ISetTicketReleaseDateForm>({
  released_at: props.ticket?.released_at
    ? transformDbDate(props.ticket.released_at)
    : undefined,
});

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

const handleSubmit = async (
  event: IFormSubmitEvent<TSetTicketReleaseDateValidationSchema>,
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
};

// derived label for the current DB release date
const currentReleaseDateLabel = computed(() => {
  const value = transformDbDate(props.ticket?.released_at);
  return value ? format(value, "yyyy/MM/dd") : "Not set";
});

// derived label for the picker value
const releasedAtLabel = computed(() => {
  const value = formState.value.released_at;
  return value ? format(value, "yyyy/MM/dd") : "Select date";
});
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Set release date`">
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
          <span class="font-medium shrink-0">Current release date</span>
          <span class="italic text-right break-words">
            {{ currentReleaseDateLabel }}
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
      :schema="SetTicketReleaseDateValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-4"
    >
      <UFormGroup
        label="Release date"
        name="released_at"
        :error="errorBag.released_at"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="releasedAtLabel"
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

      <p class="text-xs text-gray-500 dark:text-gray-400">
        Set the date when this {{ props.pageTitle.toLowerCase() }} was released
        back to the user or agency. This helps track turnaround time and
        completion.
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
        Confirm release date
      </UButton>
    </UForm>
  </BaseModal>
</template>
