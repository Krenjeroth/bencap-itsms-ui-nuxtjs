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
  await ticketStore.cancelTicket(props.ticket?.id);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Cancel this ${props.pageTitle}?`">
    <!-- <p class="font-bold text-lg text-center mb-4">Ticket Details</p> -->
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

      <div v-if="!props.ticket?.is_other_agency" class="space-y-2">
        <p class="flex justify-between">
          <span class="font-semibold">Employee: </span>
          <span class="italic">{{
            props.ticket?.item?.employee?.full_name
          }}</span>
        </p>
        <p class="flex justify-between">
          <span class="font-semibold">Department: </span>
          <span class="italic"
            >{{ props.ticket?.item?.employee?.department?.name }} ({{
              props.ticket?.item?.employee?.department?.abbreviation
            }})</span
          >
        </p>
        <p class="flex justify-between">
          <span class="font-semibold">Item: </span>
          <span class="italic"
            >{{ props.ticket?.item?.property_number }} ({{
              props.ticket?.item?.brand_model?.name
            }}
            - {{ props.ticket?.item?.brand_model?.brand?.name }})</span
          >
        </p>
      </div>

      <div v-else class="space-y-2">
        <p class="flex justify-between">
          <span class="font-semibold">Name: </span>
          <span class="italic">{{ props.ticket?.full_name }}</span>
        </p>
        <p class="flex justify-between">
          <span class="font-semibold"
            >Agency: <UBadge color="red">Outside Agency</UBadge></span
          >
          <span class="italic"
            >{{ props.ticket?.agency?.name }} ({{
              props.ticket?.agency?.abbreviation
            }})</span
          >
        </p>
        <p class="flex justify-between">
          <span class="font-semibold">Item: </span>
          <span class="italic">{{ props.ticket?.item_type?.type }}</span>
        </p>
      </div>

      <p class="flex justify-between">
        <span class="font-semibold">Concern: </span>
        <span class="italic">{{ props.ticket?.concern }}</span>
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Query Status: </span>
        <span class="italic">{{ props.ticket?.query_status_formatted }}</span>
      </p>
      <p class="flex justify-between">
        <span class="font-semibold">Request Status: </span>
        <span class="italic">{{ props.ticket?.request_status_formatted }}</span>
      </p>
    </div>

    <!-- <p class="italic">This action cannot be undone.</p>
    <p class="italic">
      All data associated with this {{ props.pageTitle }} will be deleted.
    </p> -->
    <UButton
      variant="outline"
      color="red"
      class="w-full justify-center mt-4"
      :ui="{ base: 'text-center' }"
      @click="handleSubmit"
      :loading="loading"
    >
      Yes! Cancel this {{ props.pageTitle }}
    </UButton>
  </BaseModal>
</template>
