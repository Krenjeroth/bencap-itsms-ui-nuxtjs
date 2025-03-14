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

const userStore = useUserStore();
userStore.fetchUsers();
</script>

<template>
  <h1>Users</h1>
</template>
