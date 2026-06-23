<script setup lang="ts">
definePageMeta({
  middleware: ["sanctum:auth", "permission"],
  title: "Other IT Services Requests",
  permission: "requests.other_it_services.view",
});

useHead({
  title: "Other IT Services Requests",
});

import {
  OtherItServiceRequestsCreateModal,
  OtherItServiceRequestsUpdateModal,
} from "#components";

import * as model from "./model/index";

const { can } = useCan();
const modal = useModal();
const { actionToastResult } = useToastHandler();

const requestStore = useOtherItServiceRequestsStore();
const {
  requests: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalRequests,
} = storeToRefs(requestStore);

const { columns, items } = model;

requestStore.fetchRequests();

const addRequestModal = () => {
  modal.open(OtherItServiceRequestsCreateModal, {
    pageTitle: "Other IT Service Request",
    onReloadTable() {
      requestStore.fetchRequests();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        description: "Request created.",
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
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

const editRequestModal = (request: any) => {
  modal.open(OtherItServiceRequestsUpdateModal, {
    pageTitle: "Other IT Service Request",
    request,
    onReloadTable() {
      requestStore.fetchRequests();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        description: "Request updated.",
        id: "modal-success",
        color: "green",
      });
    },
    onError() {
      actionToastResult({
        icon: "i-heroicons-x-circle",
        description: "Something went wrong.",
        id: "modal-error",
        color: "red",
      });
    },
    onNoDataChange() {
      actionToastResult({
        icon: "i-heroicons-exclamation-circle",
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

const printRequestModal = (request: any) => {
  // to be implemented
};

watch(search, () => {
  page.value = 1;
  requestStore.fetchRequests();
});

watch(pageCount, () => {
  page.value = 1;
  requestStore.fetchRequests();
});

watch([page, pageCount], () => {
  requestStore.fetchRequests();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Other IT Services Requests'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addRequestModal"
      :loading="loading"
      :action-handlers="{
        edit: editRequestModal,
        print: printRequestModal,
      }"
      :pagination="{ page, pageCount, total: totalRequests }"
      :sorting="sort"
      :search="search"
      :enable-add-data="can('requests.other_it_services.create')"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="requestStore.fetchRequests"
      @update:search="(value) => (search = value)"
    />
  </div>
</template>
