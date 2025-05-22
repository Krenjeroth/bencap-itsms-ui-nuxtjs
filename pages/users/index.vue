<script setup lang="ts">
definePageMeta({
  middleware: ["sanctum:auth", "permission"],
  title: "Users",
  permission: "user_index",
});

useHead({
  title: "Users",
});

import { UsersCreateModal } from "#components";
import * as model from "./model/index";
const modal = useModal();
// const {actionToastResult} = useToastHandler();

const userStore = useUserStore();
const {
  users: data,
  loading,
  page,
  pageCount,
  search,
  sort,
  totalUsers,
  selectedStatus,
} = storeToRefs(userStore);
const { columns, items, statusOptions } = model;
userStore.fetchUsers();

const addUserModal = () => {
  console.log("addUserModal");
  modal.open(UsersCreateModal, {
    onReloadTable() {
      userStore.fetchUsers();
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
  userStore.fetchUsers();
});

// ✅ Reset page to 1 when rows per page (`pageCount`) changes
watch(pageCount, () => {
  page.value = 1;
  userStore.fetchUsers();
});

// ✅ Ensure pagination updates correctly
watch([page, pageCount], () => {
  userStore.fetchUsers();
});

watch(selectedStatus, () => {
  page.value = 1;
  userStore.fetchUsers();
});
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Users'"
      :columns="columns"
      :action-items="items"
      :table-data="data"
      :add-data-modal="addUserModal"
      :loading="loading"
      :action-handlers="{
        create: addUserModal,
        // edit: editUserModal,
        // delete: deleteUserModal,
      }"
      :pagination="{ page, pageCount, total: totalUsers }"
      :sorting="sort"
      :search="search"
      :selected-dropdown-filter="selectedStatus"
      :enable-dropdown-filter="true"
      :dropdown-filter-options="statusOptions"
      @update:page="(value) => (page = value)"
      @update:pageCount="(value) => (pageCount = value)"
      @update:sort="userStore.fetchUsers"
      @update:search="(value) => (search = value)"
      @update:selected-dropdown-filter="(value) => (selectedStatus = value)"
    />
  </div>
</template>
