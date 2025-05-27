<script setup lang="ts">
definePageMeta({
  // middleware: ["sanctum:auth", "permission"],
  middleware: ["sanctum:auth"],
  title: "Roles",
  // permission: "department_index",
});

useHead({
  title: "Roles",
});

import {
  RolesCreateModal,
  RolesUpdateModal,
  RolesDeleteModal,
} from "#components";
import * as model from "./model/index";
const modal = useModal();
const { actionToastResult } = useToastHandler();

const roleStore = useRoleStore();
const {
  roles: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalRoles,
  selectedStatus,
} = storeToRefs(roleStore);
const { columns, items } = model;
roleStore.fetchRoles();

const addRoleModal = () => {
  modal.open(RolesCreateModal, {
    onReloadTable() {
      roleStore.fetchRoles();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Role created successfully.",
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

const editRoleModal = (role: any) => {
  modal.open(RolesUpdateModal, {
    role,
    onReloadTable() {
      roleStore.fetchRoles();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Role updated successfully.",
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

const deleteRoleModal = (role: any) => {
  modal.open(RolesDeleteModal, {
    role,
    onReloadTable() {
      roleStore.fetchRoles();
    },
    onSuccess() {
      actionToastResult({
        icon: "i-heroicons-check-circle",
        // title: "Success !",
        description: "Role deleted.",
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
  roleStore.fetchRoles();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  roleStore.fetchRoles();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  roleStore.fetchRoles();
});

watch(selectedStatus, () => {
  page.value = 1;
  roleStore.fetchRoles();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Roles'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addRoleModal"
      :loading="loading"
      :action-handlers="{
        edit: editRoleModal,
        delete: deleteRoleModal,
      }"
      :pagination="{ page, pageCount, total: totalRoles }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="roleStore.fetchRoles"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
