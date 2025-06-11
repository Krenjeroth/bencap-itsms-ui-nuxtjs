<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "IT Services",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  ItServicesCreateModal,
  ItServicesUpdateModal,
  ItServicesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const itServiceStore = useItServiceStore();
const {
  itServices: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalItServices,
  selectedStatus,
} = storeToRefs(itServiceStore);
const { columns, items } = model;
itServiceStore.fetchItServices();

const addItServiceModal = () => {
  modal.open(ItServicesCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itServiceStore.fetchItServices();
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

const editItServiceModal = (itService: any) => {
  modal.open(ItServicesUpdateModal, {
    itService,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itServiceStore.fetchItServices();
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
      itServiceStore.fetchItServices();
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
  itServiceStore.fetchItServices();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  itServiceStore.fetchItServices();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  itServiceStore.fetchItServices();
});

watch(selectedStatus, () => {
  page.value = 1;
  itServiceStore.fetchItServices();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addItServiceModal"
      :loading="loading"
      :action-handlers="{
        edit: editItServiceModal,
        delete: deleteItServiceModal,
      }"
      :pagination="{ page, pageCount, total: totalItServices }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="itServiceStore.fetchItServices"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
