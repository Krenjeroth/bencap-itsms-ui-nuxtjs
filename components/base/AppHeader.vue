<script setup lang="ts">
const { user, logout: logoutAction } = useSanctumAuth<IUser>();
const logout = async () => {
  await logoutAction();
};
const toast = useToast();
// const stringHandler = useStringHandler();
const colorMode = useColorMode();
const colorModes = ["system", "light", "dark"];
const colorModeIcon = ref("i-heroicons-computer-desktop");

onMounted(() => {
  colorModeIcon.value = getColorModeIcon();
});

const getColorModeIcon = () => {
  switch (colorMode.preference) {
    case "light":
      return "i-heroicons-sun";
    case "dark":
      return "i-heroicons-moon";
    default:
      return "i-heroicons-computer-desktop";
  }
};

const toggleColorMode = () => {
  const currentIndex = colorModes.indexOf(colorMode.preference);
  const nextIndex = (currentIndex + 1) % colorModes.length;
  colorMode.preference = colorModes[nextIndex];
  colorModeIcon.value = getColorModeIcon();

  let toastSettings = {};

  // let toastSettings = {
  //   id: `color-mode-${colorMode.preference}`,
  //   title: `Color mode: ${stringHandler.capitalizeWord(colorMode.preference)}`,
  //   description: "",
  //   timeout: 2000,
  // };

  // if (colorMode.preference === "system") {
  //   toastSettings = {
  //     ...toastSettings,
  //     description: `${stringHandler.capitalizeWord(
  //       colorMode.value
  //     )} mode detected`,
  //   };
  // }

  toast.add(toastSettings);
};

const userMenuItems = [
  [
    {
      label: "Profile",
      icon: "i-heroicons-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog-6-tooth",
      to: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: logout,
    },
  ],
];
</script>

<template>
  <header
    class="h-16 border-b border-gray-200 dark:border-gray-80 dark:bg-gray-900"
  >
    <div class="h-full px-4 flex items-center justify-between">
      <!-- Left side -->
      <div class="flex items-center gap-2 px-2 py-4 lg:px-4">
        <UAvatar src="/favicon.ico" alt="Logo" size="sm" />
        <span
          class="font-semibold text-gray-900 dark:text-white hidden lg:block"
          >ITSMS</span
        >
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <!-- Search -->
        <UButton
          variant="ghost"
          icon="i-heroicons-magnifying-glass"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        />

        <!-- Notifications -->
        <UButton
          variant="ghost"
          icon="i-heroicons-bell"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        />

        <!-- Theme Toggle -->
        <!-- <UButton
          variant="ghost"
          :icon="colorModeIcon"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="toggleColorMode"
        /> -->
        <!-- <UButton
          variant="ghost"
          icon="mdi:white-balance-sunny"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        /> -->
        <UButton
          variant="ghost"
          icon="mdi:sun-moon-stars"
          class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          size="xl"
        />

        <!-- User Menu -->
        <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
          <UButton
            variant="ghost"
            class="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <UAvatar
              src="https://avatars.githubusercontent.com/u/196264106?s=96&v=4"
              size="sm"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{
              user?.name
            }}</span>
          </UButton>
        </UDropdown>
      </div>
    </div>
  </header>
</template>
