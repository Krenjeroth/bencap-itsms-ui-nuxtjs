<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Brand Models",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  BrandModelsCreateModal,
  BrandModelsUpdateModal,
  BrandModelsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const brandModelStore = useBrandModelStore();
const {
  brandModels: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalBrandModels,
  selectedStatus,
} = storeToRefs(brandModelStore);
const { columns, items } = model;
brandModelStore.fetchBrandModels();

const addBrandModelModal = () => {
  modal.open(BrandModelsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      brandModelStore.fetchBrandModels();
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

const editBrandModelModal = (brandModel: any) => {
  modal.open(BrandModelsUpdateModal, {
    brandModel,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      brandModelStore.fetchBrandModels();
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

const deleteBrandModelModal = (brandModel: any) => {
  modal.open(BrandModelsDeleteModal, {
    brandModel,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      brandModelStore.fetchBrandModels();
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
  brandModelStore.fetchBrandModels();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  brandModelStore.fetchBrandModels();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  brandModelStore.fetchBrandModels();
});

watch(selectedStatus, () => {
  page.value = 1;
  brandModelStore.fetchBrandModels();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="route.meta.title as string"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addBrandModelModal"
      :loading="loading"
      :action-handlers="{
        edit: editBrandModelModal,
        delete: deleteBrandModelModal,
      }"
      :pagination="{ page, pageCount, total: totalBrandModels }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="brandModelStore.fetchBrandModels"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
