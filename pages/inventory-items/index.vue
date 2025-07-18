<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Inventory Items",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  InventoryItemsCreateModal,
  InventoryItemsUpdateModal,
  InventoryItemsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const inventoryItemStore = useInventoryItemStore();
const {
  inventoryItems: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalItems,
  selectedStatus,
} = storeToRefs(inventoryItemStore);
const { columns, items } = model;
inventoryItemStore.fetchInventoryItems();

const addInventoryItemModal = () => {
  modal.open(InventoryItemsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryItemStore.fetchInventoryItems();
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

const editInventoryItemModal = (item: any) => {
  modal.open(InventoryItemsUpdateModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryItemStore.fetchInventoryItems();
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

const deleteInventoryItemModal = (item: any) => {
  modal.open(InventoryItemsDeleteModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryItemStore.fetchInventoryItems();
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
  inventoryItemStore.fetchInventoryItems();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  inventoryItemStore.fetchInventoryItems();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  inventoryItemStore.fetchInventoryItems();
});

watch(selectedStatus, () => {
  page.value = 1;
  inventoryItemStore.fetchInventoryItems();
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
      :add-data-modal="addInventoryItemModal"
      :loading="loading"
      :action-handlers="{
        edit: editInventoryItemModal,
        delete: deleteInventoryItemModal,
      }"
      :pagination="{ page, pageCount, total: totalItems }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="inventoryItemStore.fetchInventoryItems"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
