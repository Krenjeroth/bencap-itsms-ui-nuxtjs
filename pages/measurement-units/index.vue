<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Measurement Units",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  MeasurementUnitsCreateModal,
  MeasurementUnitsUpdateModal,
  MeasurementUnitsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const measurementUnitStore = useMeasurementUnitStore();
const {
  measurementUnits: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalMeasurementUnits,
  selectedStatus,
} = storeToRefs(measurementUnitStore);
const { columns, items } = model;
measurementUnitStore.fetchMeasurementUnits();

const addMeasurementUnitModal = () => {
  modal.open(MeasurementUnitsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      measurementUnitStore.fetchMeasurementUnits();
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

const editMeasurementUnitModal = (measurementUnit: any) => {
  modal.open(MeasurementUnitsUpdateModal, {
    measurementUnit,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      measurementUnitStore.fetchMeasurementUnits();
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

const deleteMeasurementUnitModal = (measurementUnit: any) => {
  modal.open(MeasurementUnitsDeleteModal, {
    measurementUnit,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      measurementUnitStore.fetchMeasurementUnits();
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
  measurementUnitStore.fetchMeasurementUnits();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  measurementUnitStore.fetchMeasurementUnits();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  measurementUnitStore.fetchMeasurementUnits();
});

watch(selectedStatus, () => {
  page.value = 1;
  measurementUnitStore.fetchMeasurementUnits();
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
      :add-data-modal="addMeasurementUnitModal"
      :loading="loading"
      :action-handlers="{
        edit: editMeasurementUnitModal,
        delete: deleteMeasurementUnitModal,
      }"
      :pagination="{ page, pageCount, total: totalMeasurementUnits }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="measurementUnitStore.fetchMeasurementUnits"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
