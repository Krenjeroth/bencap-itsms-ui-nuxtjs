<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import * as model from "./model/index";

definePageMeta({
  middleware: ["sanctum:auth"],
  title: "Offices",
});

useHead({
  title: "Offices",
});

const officeStore = useOfficeStore();
const {
  offices: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalOffices,
} = storeToRefs(officeStore);

const { columns, items } = model;

const fetchOffices = () => officeStore.fetchOffices();

const debouncedSearch = useDebounceFn(() => {
  page.value = 1;
  fetchOffices();
}, 300);

await callOnce(async () => {
  await officeStore.fetchOffices();
});

watch(search, () => {
  debouncedSearch();
});

watch(page, () => {
  fetchOffices();
});

watch(pageCount, () => {
  page.value = 1;
  fetchOffices();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Offices'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :loading="loading"
      :pagination="{ page, pageCount, total: totalOffices }"
      :sorting="sort"
      :search="search"
      :enable-add-data="false"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="officeStore.fetchOffices"
      @update:search="(value) => (search = value)"
    />
  </div>
</template>
