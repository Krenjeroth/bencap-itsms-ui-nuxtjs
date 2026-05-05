<script setup lang="ts">
definePageMeta({
  middleware: ["sanctum:auth"],
  title: "Dashboard",
  // permission: "user_index",
});

useHead({
  title: "Dashboard",
});
</script>

<template>
  <div>
    <h1>Pages Index</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
  </div>
</template>
