<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, hasError } = storeToRefs(ticketStore);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

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

const handleSubmit = async () => {
  await ticketStore.cancelTicket(props.ticket?.id);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Cancel ${props.pageTitle}`">
    <div class="space-y-4">
      <!-- Ticket details -->
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
      </div>

      <!-- Client / inventory -->
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

      <!-- Concern -->
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
      >
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Concern
        </p>
        <p class="text-sm italic break-words text-gray-800 dark:text-gray-100">
          {{ props.ticket?.concern }}
        </p>
      </div>

      <!-- Explanation -->
      <p class="text-xs text-gray-500 dark:text-gray-400">
        This will mark the {{ props.pageTitle.toLowerCase() }} as
        <span class="font-semibold">Cancelled</span>.
        <br />
        Use this when the request is no longer needed or was created in error.
        Any further work should be tracked in a new ticket if required.
      </p>

      <UButton
        variant="outline"
        color="red"
        class="w-full justify-center mt-2"
        :ui="{ base: 'text-center' }"
        @click="handleSubmit"
        :loading="loading"
      >
        Confirm cancel
      </UButton>
    </div>
  </BaseModal>
</template>
