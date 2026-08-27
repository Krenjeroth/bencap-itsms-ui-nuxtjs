<script setup lang="ts">
const onlineUsersStore = useOnlineUsersStore();

const { loading, getTechnicalStaff, getNonTechnicalStaff } =
  storeToRefs(onlineUsersStore);

const refreshUsers = async () => {
  try {
    await onlineUsersStore.fetchOnlineUsers();
  } catch (error) {
    console.error("Failed to fetch online users:", error);
    throw error;
  }
};

const refreshInterval = window.setInterval(() => {
  void onlineUsersStore.fetchOnlineUsers();
}, 30_000);

onUnmounted(() => {
  window.clearInterval(refreshInterval);
});

await onlineUsersStore.fetchOnlineUsers();
</script>

<template>
  <section class="rounded-2xl bg-stone-50 p-5 dark:bg-stone-900">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <p
          class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
        >
          Team presence
        </p>

        <h2 class="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">
          Online Users
        </h2>

        <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Live availability based on each user’s heartbeat.
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

    <!-- Technical IT Staff -->
    <div class="mb-8">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-bold text-stone-800 dark:text-stone-200">
          Technical IT Staff
        </h3>

        <span
          class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          {{ getTechnicalStaff.length }}
        </span>
      </div>

      <div
        v-if="getTechnicalStaff.length"
        class="flex gap-2 overflow-x-auto rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
      >
        <UsersPresenceAvatar
          v-for="user in getTechnicalStaff"
          :key="user.id"
          :user="user"
        />
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
      >
        No technical IT staff found.
      </div>
    </div>

    <!-- Non-Technical Staff -->
    <div>
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-bold text-stone-800 dark:text-stone-200">
          IT Admin Staff
        </h3>

        <span
          class="rounded-full bg-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-300"
        >
          {{ getNonTechnicalStaff.length }}
        </span>
      </div>

      <div
        v-if="getNonTechnicalStaff.length"
        class="flex gap-2 overflow-x-auto rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
      >
        <UsersPresenceAvatar
          v-for="user in getNonTechnicalStaff"
          :key="user.id"
          :user="user"
        />
      </div>

      <div
        v-else
        class="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
      >
        No non-technical staff found.
      </div>
    </div>
  </section>
</template>
