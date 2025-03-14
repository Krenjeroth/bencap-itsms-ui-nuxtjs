<script setup lang="ts">
const links = [
  {
    label: "Dashboard",
    icon: "i-heroicons-home",
    to: "/",
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
  {
    label: "Users",
    icon: "i-heroicons-users",
    to: "/users",
  },
  // {
  //   label: "Members",
  //   icon: "i-heroicons-user-group",
  //   to: "/members",
  // },
  {
    label: "---LOGIN (DEV/DEB)---",
    icon: "i-heroicons-bug-ant",
    to: "/auth/login",
  },
];
</script>
<template>
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
