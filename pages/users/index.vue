<script setup lang="ts">
definePageMeta({
  middleware: ["sanctum:auth"],
  // middleware: ["sanctum:auth", "permission"],
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
const { users: data, loading } = storeToRefs(userStore);
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
</script>

<template>
  <div>
    <UiDatatable
      :module-title="'Users'"
      :columns="columns"
      :table-data="data"
      :loading="loading"
      :add-data-modal="addUserModal"
    />
  </div>
</template>
