<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Tickets",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  TicketsCreateModal,
  TicketsUpdateModal,
  ItServicesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const ticketStore = useTicketStore();
const {
  tickets: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalTickets,
  selectedStatus,
} = storeToRefs(ticketStore);
const { columns, items, expandableDetails } = model;
ticketStore.fetchTickets();

const addTicketModal = () => {
  modal.open(TicketsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} created.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

const editTicketModal = (ticket: any) => {
  modal.open(TicketsUpdateModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} updated.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onNoDataChange() {
      actionToastResult({
        icon: "i-heroicons-exclamation-circle",
        // title: "Error !",
        description: "No data changes detected.",
        id: "modal-warning",
        color: "yellow",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

const deleteItServiceModal = (itService: any) => {
  modal.open(ItServicesDeleteModal, {
    itService,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} deleted.`,
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        // title: "Error !",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onClose() {
      modal.close();
    },
  });
};

// Watch search changes and fetch when updated
watch(search, () => {
  page.value = 1; // Reset page
  ticketStore.fetchTickets();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  ticketStore.fetchTickets();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  ticketStore.fetchTickets();
});

watch(selectedStatus, () => {
  page.value = 1;
  ticketStore.fetchTickets();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :is-expandable="true"
      :expandable-details="expandableDetails"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addTicketModal"
      :loading="loading"
      :action-handlers="{
        edit: editTicketModal,
        delete: deleteItServiceModal,
      }"
      :pagination="{ page, pageCount, total: totalTickets }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="ticketStore.fetchTickets"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
