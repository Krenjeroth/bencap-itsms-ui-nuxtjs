<script setup lang="ts">
const route = useRoute();

const authPages = ["auth-login"];
const isAuthPage = computed(() => authPages.includes(route.name as string));
</script>

<template>
  <div class="min-h-screen flex">
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <BaseAppHeader v-if="!isAuthPage" />

      <div class="flex-1 flex">
        <!-- Sidebar -->
        <BaseAppSidebar v-if="!isAuthPage" />
        <!-- Page Content -->
        <main class="flex-1 p-4 dark:bg-gray-900">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
