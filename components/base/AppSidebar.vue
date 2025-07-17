<script setup lang="ts">
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close-sidebar"]);

const links = [
  [
    {
      label: "Control Panel",
    },
    {
      label: "Agencies",
      icon: "material-symbols:identity-platform-outline-rounded",
      to: "/agencies",
    },
    {
      label: "Brands",
      icon: "material-symbols:shoppingmode-outline",
      to: "/brands",
    },
    {
      label: "Brand Models",
      icon: "material-symbols:memory-outline-rounded",
      to: "/brand-models",
    },
    {
      label: "Common Problems",
      icon: "material-symbols:sync-problem-outline-rounded",
      to: "/common-problems",
    },
    {
      label: "Departments",
      icon: "i-heroicons-building-office-2",
      to: "/departments",
    },
    {
      label: "Item Types",
      icon: "material-symbols:trolley-outline-rounded",
      to: "/item-types",
    },
    {
      label: "Measurement Units",
      icon: "material-symbols:measuring-tape-outline-rounded",
      to: "/measurement-units",
    },
    {
      label: "Permissions",
      icon: "i-heroicons-lock-closed",
      to: "/permissions",
    },
    {
      label: "Positions",
      icon: "i-heroicons-briefcase",
      to: "/positions",
    },
    {
      label: "Roles",
      icon: "i-heroicons-user-group",
      to: "/roles",
    },
    {
      label: "IT Services",
      icon: "i-heroicons-wrench-screwdriver",
      to: "/it-services",
    },
    {
      label: "Users",
      icon: "i-heroicons-users",
      to: "/users",
    },
  ],
  [
    {
      label: "Dashboard",
      icon: "i-heroicons-home",
      to: "/",
    },
    {
      label: "Employees",
      icon: "material-symbols:badge-outline",
      to: "/employees",
    },
    {
      label: "Items",
      icon: "i-heroicons-archive-box",
      to: "/items",
    },
    {
      label: "Solutions",
      icon: "material-symbols:search-check-2-outline-rounded",
      to: "/solutions",
    },
    {
      label: "Tickets",
      icon: "i-heroicons-ticket",
      to: "/tickets",
    },
    // {
    //   label: "Analytics",
    //   icon: "i-heroicons-chart-bar",
    //   to: "/",
    // },
    // {
    //   label: "Settings",
    //   icon: "i-heroicons-cog-6-tooth",
    //   to: "/",
    // },
    // {
    //   label: "---LOGIN (DEV/DEB)---",
    //   icon: "i-heroicons-bug-ant",
    //   to: "/auth/login",
    // },
  ],
];

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit("close-sidebar");
}
</script>
<template>
  <!-- Mobile overlay -->
  <transition name="fade">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-[1300] bg-black bg-opacity-40 lg:hidden"
      @click="handleOverlayClick"
      style="backdrop-filter: none"
    >
      <aside
        class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-[1400] flex flex-col"
        style="backdrop-filter: none"
      >
        <UButton
          variant="ghost"
          icon="i-heroicons-x-mark"
          class="self-end m-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          @click="$emit('close-sidebar')"
          aria-label="Close sidebar"
        />

        <UVerticalNavigation
          :links="links"
          :ui="{
            wrapper: '',
            base: 'flex items-center rounded-lg transition-colors px-2 py-2 justify-start text-left w-full',
            label: 'block w-full text-left',
            icon: {
              base: 'flex-shrink-0 w-6 h-6 items-center block hover:text-primary dark:text-gray-400',
            },
          }"
        />
      </aside>
    </div>
  </transition>

  <!-- Desktop sidebar -->
  <aside
    class="hidden overflow-y-auto lg:block lg:w-[--sidebar-width] lg:max-h[calc(100vh-var(--header-height))] lg:top-[--header-height] py-2 lg:px-1 lg:mx-1 border-r border-gray-200 dark:border-gray-800"
  >
    <UVerticalNavigation
      :links="links"
      :ui="{
        wrapper: 'lg:block',
        base: 'flex items-center rounded-lg transition-colors px-2 py-2 lg:px-4 justify-center lg:justify-start lg:gap-3',
        label: 'hidden lg:block',
        icon: {
          base: 'flex-shrink-0 w-6 h-6 items-center block hover:text-primary dark:text-gray-400',
        },
      }"
    />
  </aside>
</template>

<style scoped>
/* .u-vertical-navigation {
  @apply transition-all duration-300;
}

@media (max-width: 768px) {
  .u-vertical-navigation {
    @apply fixed left-0 top-0 z-50 transform -translate-x-full;
  }

  .u-vertical-navigation.is-open {
    @apply translate-x-0;
  }
} */
</style>
