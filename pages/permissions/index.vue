<script setup lang="ts">
definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Permissions",
  // permission: "department_index",
});

useHead({
  title: "Permissions",
});

import {
  PermissionsCreateModal,
  PermissionsUpdateModal,
  PermissionsDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const permissionStore = usePermissionStore();
const {
  permissions: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalPermissions,
  selectedStatus,
} = storeToRefs(permissionStore);
const { columns, items } = model;
permissionStore.fetchPermissions();

const addPermissionModal = () => {
  modal.open(PermissionsCreateModal, {
    onReloadTable() {
      permissionStore.fetchPermissions();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Permission created.",
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

const editPermissionModal = (permission: any) => {
  modal.open(PermissionsUpdateModal, {
    permission,
    onReloadTable() {
      permissionStore.fetchPermissions();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Permission updated.",
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

const deletePermissionModal = (permission: any) => {
  modal.open(PermissionsDeleteModal, {
    permission,
    onReloadTable() {
      permissionStore.fetchPermissions();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Permission deleted.",
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
  permissionStore.fetchPermissions();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  permissionStore.fetchPermissions();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  permissionStore.fetchPermissions();
});

watch(selectedStatus, () => {
  page.value = 1;
  permissionStore.fetchPermissions();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Permissions'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addPermissionModal"
      :loading="loading"
      :action-handlers="{
        edit: editPermissionModal,
        delete: deletePermissionModal,
      }"
      :pagination="{ page, pageCount, total: totalPermissions }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="permissionStore.fetchPermissions"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
