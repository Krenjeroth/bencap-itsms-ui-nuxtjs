<script setup lang="ts">
const route = useRoute();

definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Brands",
  // permission: "department_index",
});

useHead({
  title: () => route.meta.title as string,
});

const { strSingular } = useStringHandler();

const pageTitleSingular = strSingular(route.meta.title as string);

import {
  BrandsCreateModal,
  BrandsUpdateModal,
  BrandsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const brandStore = useBrandStore();
const {
  brands: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalBrands,
  selectedStatus,
} = storeToRefs(brandStore);
const { columns, items } = model;
brandStore.fetchBrands();

const addBrandModal = () => {
  modal.open(BrandsCreateModal, {
    pageTitle: pageTitleSingular,
    onReloadTable() {
      brandStore.fetchBrands();
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

const editBrandModal = (brand: any) => {
  modal.open(BrandsUpdateModal, {
    brand,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      brandStore.fetchBrands();
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

const deleteBrandModal = (brand: any) => {
  modal.open(BrandsDeleteModal, {
    brand,
    pageTitle: pageTitleSingular,
    onReloadTable() {
      brandStore.fetchBrands();
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
  brandStore.fetchBrands();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  brandStore.fetchBrands();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  brandStore.fetchBrands();
});

watch(selectedStatus, () => {
  page.value = 1;
  brandStore.fetchBrands();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Brands'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addBrandModal"
      :loading="loading"
      :action-handlers="{
        edit: editBrandModal,
        delete: deleteBrandModal,
      }"
      :pagination="{ page, pageCount, total: totalBrands }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="brandStore.fetchBrands"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
