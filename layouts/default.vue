<script setup lang="ts">
const route = useRoute();

const authPages = ["auth-login"];
const isAuthPage = computed(() => authPages.includes(route.name as string));

// Sidebar state for mobile
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen flex">
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <BaseAppHeader
        v-if="!isAuthPage"
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />

      <main class="flex-1 flex min-h-[calc(50vh-var(--header-height))]">
        <!-- Sidebar -->
        <BaseAppSidebar
          v-if="!isAuthPage"
          :is-open="isSidebarOpen"
          @close-sidebar="closeSidebar"
        />
        <!-- Page Content -->
        <div
          class="flex-1 mx-auto p-2 lg:p-6"
          :class="!isAuthPage ? 'mx-auto' : 'm-auto'"
        >
          <slot />
        </div>
      </main>

      <UDivider
        class="h-px bg-gray-200 dark:bg-gray-800"
        :ui="{ container: { base: 'bg-white dark:bg-gray-900 px-4' } }"
      >
        <SvgsLogo class="w-12 h-12 lg:w-10 lg:h-10" />
      </UDivider>
      <BaseAppFooter />
    </div>
  </div>
</template>
