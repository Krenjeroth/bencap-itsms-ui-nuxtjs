<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Inventories",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  InventoriesCreateModal,
  InventoriesUpdateModal,
  InventoriesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const inventoryStore = useInventoryStore();
const {
  inventories: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalInventories,
  selectedStatus,
} = storeToRefs(inventoryStore);
const { columns, items, expandableDetails } = model;
inventoryStore.fetchInventories();

const addInventoryModal = () => {
  modal.open(InventoriesCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
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

const editInventoryModal = (item: any) => {
  modal.open(InventoriesUpdateModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
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

const deleteInventoryModal = (item: any) => {
  modal.open(InventoriesDeleteModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      inventoryStore.fetchInventories();
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
  inventoryStore.fetchInventories();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  inventoryStore.fetchInventories();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  inventoryStore.fetchInventories();
});

watch(selectedStatus, () => {
  page.value = 1;
  inventoryStore.fetchInventories();
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
      :add-data-modal="addInventoryModal"
      :loading="loading"
      :action-handlers="{
        edit: editInventoryModal,
        delete: deleteInventoryModal,
      }"
      :pagination="{ page, pageCount, total: totalInventories }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="inventoryStore.fetchInventories"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
