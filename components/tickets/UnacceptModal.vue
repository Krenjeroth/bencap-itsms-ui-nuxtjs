<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, hasError } = storeToRefs(ticketStore);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

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

const handleSubmit = async () => {
  await ticketStore.unacceptTicket(props.ticket?.id);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Are you sure you want to un-accept this ${props.pageTitle}?`"
  >
    <div class="flex flex-col gap-2">
      <p class="flex justify-between">
        <span class="font-semibold">Ticket Number: </span>
        <span class="italic">{{ props.ticket?.ticket_number }}</span>
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Assistance Type: </span>
        <span class="italic"
          >{{ props.ticket?.it_service?.name }} ({{
            props.ticket?.it_service?.code
          }})</span
        >
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Concern: </span>
        <span class="italic">{{ props.ticket?.concern }}</span>
      </p>
    </div>

    <p class="italic text-sm text-gray-400 mt-2">
      You will be removed from the assigned personnel for this
      {{ props.pageTitle }}. Status will remain unchanged.
    </p>

    <UButton
      variant="outline"
      color="red"
      class="w-full justify-center mt-4"
      :ui="{ base: 'text-center' }"
      @click="handleSubmit"
      :loading="loading"
    >
      Un-accept this {{ props.pageTitle }}
    </UButton>
  </BaseModal>
</template>
