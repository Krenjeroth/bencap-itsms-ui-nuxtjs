<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "IT Supplies",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  ItSuppliesCreateModal,
  ItSuppliesUpdateModal,
  ItSuppliesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const itSupplyStore = useItSupplyStore();
const {
  itSupplies: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalItSupplies,
  selectedStatus,
} = storeToRefs(itSupplyStore);
const { columns, items } = model;
itSupplyStore.fetchItSupplies();

const addItSupplyModal = () => {
  modal.open(ItSuppliesCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itSupplyStore.fetchItSupplies();
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

const editItSupplyModal = (item: any) => {
  modal.open(ItSuppliesUpdateModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itSupplyStore.fetchItSupplies();
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

const deleteItSupplyModal = (item: any) => {
  modal.open(ItSuppliesDeleteModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itSupplyStore.fetchItSupplies();
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
  itSupplyStore.fetchItSupplies();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  itSupplyStore.fetchItSupplies();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  itSupplyStore.fetchItSupplies();
});

watch(selectedStatus, () => {
  page.value = 1;
  itSupplyStore.fetchItSupplies();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :is-expandable="false"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addItSupplyModal"
      :loading="loading"
      :action-handlers="{
        edit: editItSupplyModal,
        delete: deleteItSupplyModal,
      }"
      :pagination="{ page, pageCount, total: totalItSupplies }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="itSupplyStore.fetchItSupplies"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
