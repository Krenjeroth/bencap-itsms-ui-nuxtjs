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
  TicketsAcceptModal,
  TicketsCheckStockModal,
  TicketsAwaitPartModal,
  TicketsResolveModal,
  TicketsCancelModal,
  TicketsReopenModal,
  TicketsSetServiceMethodModal,
  TicketsSetReleaseDateModal,
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

// const deleteItServiceModal = (itService: any) => {
//   modal.open(ItServicesDeleteModal, {
//     itService,
//     pageTitle: pageTitleSingular,
//     onReloadTable() {
//       ticketStore.fetchTickets();
//     },
//     onSuccess() {
//       actionToastResult({
//         icon: "i-heroicons-check-circle",
//         // title: "Success !",
//         description: `${pageTitleSingular} deleted.`,
//         id: "modal-success",
//         color: "green",
//       });
//     },
//     onError() {
//       actionToastResult({
//         icon: "i-heroicons-x-circle",
//         // title: "Error !",
//         description: "Something went wrong.",
//         id: "modal-error",
//         color: "red",
//       });
//     },
//     onClose() {
//       modal.close();
//     },
//   });
// };

const acceptTicketModal = (ticket: any) => {
  modal.open(TicketsAcceptModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} accepted.`,
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

const checkStockModal = (ticket: any) => {
  modal.open(TicketsCheckStockModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `Checking stock.`,
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

const awaitPartModal = (ticket: any) => {
  modal.open(TicketsAwaitPartModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `Awaiting stock.`,
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

const resolveModal = (ticket: any) => {
  modal.open(TicketsResolveModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `Resolved ${pageTitleSingular}.`,
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

const cancelModal = (ticket: any) => {
  modal.open(TicketsCancelModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} Cancelled.`,
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

const reopenModal = (ticket: any) => {
  modal.open(TicketsReopenModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `${pageTitleSingular} Reopened.`,
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

const setServiceMethodModal = (ticket: any) => {
  modal.open(TicketsSetServiceMethodModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `Service Method Set.`,
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

const setReleaseDateModal = (ticket: any) => {
  modal.open(TicketsSetReleaseDateModal, {
    ticket,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      ticketStore.fetchTickets();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: `Release Date Set.`,
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
        // delete: deleteItServiceModal,
        accept: acceptTicketModal,
        checkStock: checkStockModal,
        awaitPart: awaitPartModal,
        resolve: resolveModal,
        cancel: cancelModal,
        reopen: reopenModal,
        setServiceMethod: setServiceMethodModal,
        setReleaseDate: setReleaseDateModal,
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
