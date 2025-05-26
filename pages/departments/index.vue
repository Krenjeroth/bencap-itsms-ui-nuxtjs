<script setup lang="ts">
definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Departments",
  // permission: "department_index",
});

useHead({
  title: "Departments",
});

import { DepartmentsCreateModal } from "#components";
import * as model from "./model/index";
const modal = useModal();
// const {actionToastResult} = useToastHandler();

const departmentStore = useDepartmentStore();
const {
  departments: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalDepartments,
  selectedStatus,
} = storeToRefs(departmentStore);
const { columns, items } = model;
departmentStore.fetchDepartments();

const addDepartmentModal = () => {
  modal.open(DepartmentsCreateModal, {
    onReloadTable() {
      departmentStore.fetchDepartments();
    },
    onSuccess() {
      // actionToastResult({
      //   icon: "i-heroicons-check-circle",
      //   // title: "Success !",
      //   description: "User created successfully.",
      //   id: "modal-success",
      //   color: "green",
      // });
    },
    onError() {
      // actionToastResult({
      //   icon: "i-heroicons-x-circle",
      //   // title: "Error !",
      //   description: "Something went wrong.",
      //   id: "modal-error",
      //   color: "red",
      // });
    },
    onClose() {
      modal.close();
    },
  });
};

// Watch search changes and fetch when updated
watch(search, () => {
  page.value = 1; // Reset page
  departmentStore.fetchDepartments();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  departmentStore.fetchDepartments();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  departmentStore.fetchDepartments();
});

watch(selectedStatus, () => {
  page.value = 1;
  departmentStore.fetchDepartments();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Departments'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addDepartmentModal"
      :loading="loading"
      :action-handlers="{
        // edit: editUserModal,
        // delete: deleteUserModal,
      }"
      :pagination="{ page, pageCount, total: totalDepartments }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="departmentStore.fetchDepartments"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
