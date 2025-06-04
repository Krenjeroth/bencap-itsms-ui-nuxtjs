<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Common Problems",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  CommonProblemsCreateModal,
  CommonProblemsUpdateModal,
  CommonProblemsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const commonProblemStore = useCommonProblemStore();
const {
  commonProblems: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalCommonProblems,
  selectedStatus,
} = storeToRefs(commonProblemStore);
const { columns, items } = model;
commonProblemStore.fetchCommonProblems();

const addCommonProblemModal = () => {
  modal.open(CommonProblemsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      commonProblemStore.fetchCommonProblems();
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

const editCommonProblemModal = (commonProblem: any) => {
  modal.open(CommonProblemsUpdateModal, {
    commonProblem,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      commonProblemStore.fetchCommonProblems();
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
      commonProblemStore.fetchCommonProblems();
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
  commonProblemStore.fetchCommonProblems();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  commonProblemStore.fetchCommonProblems();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  commonProblemStore.fetchCommonProblems();
});

watch(selectedStatus, () => {
  page.value = 1;
  commonProblemStore.fetchCommonProblems();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addCommonProblemModal"
      :loading="loading"
      :action-handlers="{
        edit: editCommonProblemModal,
        delete: deleteCommonProblemModal,
      }"
      :pagination="{ page, pageCount, total: totalCommonProblems }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="commonProblemStore.fetchCommonProblems"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
