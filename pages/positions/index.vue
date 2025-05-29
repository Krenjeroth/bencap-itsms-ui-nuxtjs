<script setup lang="ts">
definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Positions",
  // permission: "department_index",
});

useHead({
  title: "Positions",
});

import {
  PositionsCreateModal,
  PositionsUpdateModal,
  PositionsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const positionStore = usePositionStore();
const {
  positions: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalPositions,
  selectedStatus,
} = storeToRefs(positionStore);
const { columns, items } = model;
positionStore.fetchPositions();

const addPositionModal = () => {
  modal.open(PositionsCreateModal, {
    onReloadTable() {
      positionStore.fetchPositions();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Position created.",
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

const editPositionModal = (position: any) => {
  modal.open(PositionsUpdateModal, {
    position,
    onReloadTable() {
      positionStore.fetchPositions();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Position updated.",
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

const deletePositionModal = (position: any) => {
  modal.open(PositionsDeleteModal, {
    position,
    onReloadTable() {
      positionStore.fetchPositions();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Position deleted.",
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
  positionStore.fetchPositions();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  positionStore.fetchPositions();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  positionStore.fetchPositions();
});

watch(selectedStatus, () => {
  page.value = 1;
  positionStore.fetchPositions();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Positions'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addPositionModal"
      :loading="loading"
      :action-handlers="{
        edit: editPositionModal,
        delete: deletePositionModal,
      }"
      :pagination="{ page, pageCount, total: totalPositions }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="positionStore.fetchPositions"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
