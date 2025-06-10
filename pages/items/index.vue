<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Items",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  ItemsCreateModal,
  ItemsUpdateModal,
  CommonProblemsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const itemStore = useItemStore();
const {
  items: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalItems,
  selectedStatus,
} = storeToRefs(itemStore);
const { columns, items, expandableDetails } = model;
itemStore.fetchItems();

const addItemModal = () => {
  modal.open(ItemsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itemStore.fetchItems();
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

const editItemModal = (item: any) => {
  modal.open(ItemsUpdateModal, {
    item,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itemStore.fetchItems();
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

const deleteCommonProblemModal = (commonProblem: any) => {
  modal.open(CommonProblemsDeleteModal, {
    commonProblem,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      itemStore.fetchItems();
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
  itemStore.fetchItems();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  itemStore.fetchItems();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  itemStore.fetchItems();
});

watch(selectedStatus, () => {
  page.value = 1;
  itemStore.fetchItems();
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
      :add-data-modal="addItemModal"
      :loading="loading"
      :action-handlers="{
        edit: editItemModal,
        delete: deleteCommonProblemModal,
      }"
      :pagination="{ page, pageCount, total: totalItems }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="itemStore.fetchItems"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
