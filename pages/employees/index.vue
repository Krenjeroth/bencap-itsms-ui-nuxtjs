<script setup lang="ts">
definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Employees",
  // permission: "department_index",
});

useHead({
  title: "Employees",
});

import {
  EmployeesCreateModal,
  EmployeesUpdateModal,
  PermissionsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const employeeStore = useEmployeeStore();
const {
  employees: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalEmployees,
  selectedStatus,
} = storeToRefs(employeeStore);
const { columns, items } = model;
employeeStore.fetchEmployees();

const addEmployeeModal = () => {
  modal.open(EmployeesCreateModal, {
    onReloadTable() {
      employeeStore.fetchEmployees();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Employee created.",
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

const editEmployeeModal = (employee: any) => {
  modal.open(EmployeesUpdateModal, {
    employee,
    onReloadTable() {
      employeeStore.fetchEmployees();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Employee updated.",
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

// const deletePermissionModal = (permission: any) => {
//   modal.open(PermissionsDeleteModal, {
//     permission,
//     onReloadTable() {
//       permissionStore.fetchPermissions();
//     },
//     onSuccess() {
//       actionToastResult({
//         icon: "i-heroicons-check-circle",
//         // title: "Success !",
//         description: "Permission deleted.",
//         id: "modal-success",
//         color: "green",
//       });
//     },
//     onError() {
//       actionToastResult({
//         icon: "i-heroicons-x-circle",
//         // title: "Error !",
//         description: "Something went wrong.",
//         id: "modal-error",
//         color: "red",
//       });
//     },
//     onClose() {
//       modal.close();
//     },
//   });
// };

// Watch search changes and fetch when updated
watch(search, () => {
  page.value = 1; // Reset page
  employeeStore.fetchEmployees();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  employeeStore.fetchEmployees();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  employeeStore.fetchEmployees();
});

watch(selectedStatus, () => {
  page.value = 1;
  employeeStore.fetchEmployees();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Permissions'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addEmployeeModal"
      :loading="loading"
      :action-handlers="{
        edit: editEmployeeModal,
        // delete: deleteEmployeeModal,
      }"
      :pagination="{ page, pageCount, total: totalEmployees }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="employeeStore.fetchEmployees"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
