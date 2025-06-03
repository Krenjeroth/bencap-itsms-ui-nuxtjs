<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Item Types",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  ItemTypesCreateModal,
  ItemTypesUpdateModal,
  ItemTypesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const itemTypeStore = useItemTypeStore();
const {
  itemTypes: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalItemTypes,
  selectedStatus,
} = storeToRefs(itemTypeStore);
const { columns, items, classificationOptions } = model;
itemTypeStore.fetchItemTypes();

const addItemTypeModal = () => {
  modal.open(ItemTypesCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itemTypeStore.fetchItemTypes();
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

const editItemTypeModal = (itemType: any) => {
  modal.open(ItemTypesUpdateModal, {
    itemType,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itemTypeStore.fetchItemTypes();
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

const deleteItemTypeModal = (itemType: any) => {
  modal.open(ItemTypesDeleteModal, {
    itemType,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itemTypeStore.fetchItemTypes();
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
  itemTypeStore.fetchItemTypes();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  itemTypeStore.fetchItemTypes();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  itemTypeStore.fetchItemTypes();
});

watch(selectedStatus, () => {
  page.value = 1;
  itemTypeStore.fetchItemTypes();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addItemTypeModal"
      :loading="loading"
      :action-handlers="{
        edit: editItemTypeModal,
        delete: deleteItemTypeModal,
      }"
      :pagination="{ page, pageCount, total: totalItemTypes }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="itemTypeStore.fetchItemTypes"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
