<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Agencies",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  AgenciesCreateModal,
  AgenciesUpdateModal,
  AgenciesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const agencyStore = useAgencyStore();
const {
  agencies: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalAgencies,
  selectedStatus,
} = storeToRefs(agencyStore);
const { columns, items } = model;
agencyStore.fetchAgencies();

const addAgencyModal = () => {
  modal.open(AgenciesCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      agencyStore.fetchAgencies();
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

const editAgencyModal = (agency: any) => {
  modal.open(AgenciesUpdateModal, {
    agency,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      agencyStore.fetchAgencies();
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

const deleteAgencyModal = (agency: any) => {
  modal.open(AgenciesDeleteModal, {
    agency,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      agencyStore.fetchAgencies();
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
  agencyStore.fetchAgencies();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  agencyStore.fetchAgencies();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  agencyStore.fetchAgencies();
});

watch(selectedStatus, () => {
  page.value = 1;
  agencyStore.fetchAgencies();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Agencies'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addAgencyModal"
      :loading="loading"
      :action-handlers="{
        edit: editAgencyModal,
        delete: deleteAgencyModal,
      }"
      :pagination="{ page, pageCount, total: totalAgencies }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="agencyStore.fetchAgencies"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
