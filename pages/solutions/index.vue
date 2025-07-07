<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Solutions",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  SolutionsCreateModal,
  SolutionsUpdateModal,
  SolutionsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const solutionStore = useSolutionStore();
const {
  solutions: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalSolutions,
  selectedStatus,
} = storeToRefs(solutionStore);
const { columns, items, expandableDetails } = model;
solutionStore.fetchSolutions();

const addSolutionModal = () => {
  modal.open(SolutionsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      solutionStore.fetchSolutions();
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

const editSolutionModal = (solution: any) => {
  modal.open(SolutionsUpdateModal, {
    solution,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      solutionStore.fetchSolutions();
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

const deleteSolutionModal = (solution: any) => {
  modal.open(SolutionsDeleteModal, {
    solution,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      solutionStore.fetchSolutions();
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
  solutionStore.fetchSolutions();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  solutionStore.fetchSolutions();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  solutionStore.fetchSolutions();
});

watch(selectedStatus, () => {
  page.value = 1;
  solutionStore.fetchSolutions();
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
      :add-data-modal="addSolutionModal"
      :loading="loading"
      :action-handlers="{
        edit: editSolutionModal,
        delete: deleteSolutionModal,
      }"
      :pagination="{ page, pageCount, total: totalSolutions }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="solutionStore.fetchSolutions"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
