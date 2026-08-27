<script setup lang="ts">
const onlineUsersStore = useOnlineUsersStore();

const {
  loading,
  lastFetched,
  onlineCount,
  busyCount,
  offlineCount,
  getTechnicalStaff,
  getNonTechnicalStaff,
} = storeToRefs(onlineUsersStore);

const refreshUsers = async () => {
  try {
    await onlineUsersStore.fetchOnlineUsers();
  } catch (error) {
    console.error("Failed to fetch online users:", error);
  }
};

const lastUpdatedText = computed(() => {
  if (!lastFetched.value) {
    return "Not updated yet";
  }

  return `Updated ${lastFetched.value.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })}`;
});

const refreshInterval = window.setInterval(() => {
  void refreshUsers();
}, 30_000);

onUnmounted(() => {
  window.clearInterval(refreshInterval);
});

onMounted(() => {
  void refreshUsers();
});
</script>

<template>
  <section class="rounded-2xl bg-stone-50 p-5 dark:bg-stone-900">
    <!-- Section header -->
    <div
      class="mb-5 flex flex-col gap-4 border-b border-stone-200 pb-5 dark:border-stone-800 lg:flex-row lg:items-start lg:justify-between"
    >
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

          <p
            class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
          >
            Team presence
          </p>
        </div>

        <h2 class="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">
          Online Users
        </h2>

        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Monitor current IT staff availability and activity.
        </p>

        <p class="mt-2 text-xs text-stone-400 dark:text-stone-500">
          {{ lastUpdatedText }}
        </p>
      </div>

      <UButton
        color="primary"
        icon="i-heroicons-arrow-path"
        :loading="loading"
        @click="refreshUsers"
      >
        Refresh
      </UButton>
    </div>

    <!-- Presence summary -->
    <div class="mb-7 grid grid-cols-3 gap-2 sm:max-w-md sm:gap-3">
      <div
        class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/70 dark:bg-emerald-950/30"
      >
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500" />
          <span
            class="text-xs font-medium text-emerald-700 dark:text-emerald-300"
          >
            Online
          </span>
        </div>

        <p
          class="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-200"
        >
          {{ onlineCount }}
        </p>
      </div>

      <div
        class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/70 dark:bg-amber-950/30"
      >
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-amber-400" />
          <span class="text-xs font-medium text-amber-700 dark:text-amber-300">
            Busy
          </span>
        </div>

        <p class="mt-1 text-xl font-bold text-amber-800 dark:text-amber-200">
          {{ busyCount }}
        </p>
      </div>

      <div
        class="rounded-xl border border-stone-200 bg-white px-3 py-2.5 dark:border-stone-700 dark:bg-stone-800"
      >
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-stone-400 dark:bg-stone-500" />
          <span class="text-xs font-medium text-stone-600 dark:text-stone-300">
            Offline
          </span>
        </div>

        <p class="mt-1 text-xl font-bold text-stone-800 dark:text-stone-200">
          {{ offlineCount }}
        </p>
      </div>
    </div>

    <!-- Technical IT staff -->
    <div class="mb-7">
      <div class="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-stone-800 dark:text-stone-200">
            Technical IT Staff
          </h3>

          <p class="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            Personnel available for technical support and ticket handling.
          </p>
        </div>

        <span
          class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          {{ getTechnicalStaff.length }}
        </span>
      </div>

      <div
        v-if="getTechnicalStaff.length"
        class="overflow-x-auto rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
      >
        <div class="flex min-w-max gap-2">
          <UsersPresenceAvatar
            v-for="user in getTechnicalStaff"
            :key="user.id"
            :user="user"
          />
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400"
      >
        No technical IT staff found.
      </div>
    </div>

    <!-- Non-technical staff -->
    <div>
      <div class="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-stone-800 dark:text-stone-200">
            IT Admin Staff
          </h3>

          <p class="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            Administrative and coordination personnel.
          </p>
        </div>

        <span
          class="rounded-full bg-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-300"
        >
          {{ getNonTechnicalStaff.length }}
        </span>
      </div>

      <div
        v-if="getNonTechnicalStaff.length"
        class="overflow-x-auto rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
      >
        <div class="flex min-w-max gap-2">
          <UsersPresenceAvatar
            v-for="user in getNonTechnicalStaff"
            :key="user.id"
            :user="user"
          />
        </div>
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400"
      >
        No IT admin staff found.
      </div>
    </div>
  </section>
</template>
