<script setup lang="ts">
const { fetchDashboardSummaryApi } = useTicketApi();

definePageMeta({
  middleware: ["sanctum:auth"],
  title: "Dashboard",
});

useHead({
  title: "Dashboard",
});

interface DashboardSummary {
  open_tickets: number;
  unassigned_tickets: number;
  awaiting_parts: number;
  resolved_today: number;
}

const summary = ref<DashboardSummary>({
  open_tickets: 0,
  unassigned_tickets: 0,
  awaiting_parts: 0,
  resolved_today: 0,
});

const loadingSummary = ref(false);

const fetchDashboardSummary = async () => {
  if (loadingSummary.value) {
    return;
  }

  loadingSummary.value = true;

  try {
    const response = await fetchDashboardSummaryApi();

    summary.value = response as DashboardSummary;
  } catch (error) {
    console.error("Failed to fetch dashboard summary:", error);
  } finally {
    loadingSummary.value = false;
  }
};

const dashboardInterval = window.setInterval(() => {
  void fetchDashboardSummary();
}, 30_000);

onUnmounted(() => {
  window.clearInterval(dashboardInterval);
});

onMounted(() => {
  void fetchDashboardSummary();
});
</script>

<template>
  <main class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <div
          class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        >
          <UIcon name="i-heroicons-squares-2x2" class="h-5 w-5" />
        </div>

        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
          >
            IT Service Management
          </p>

          <h1
            class="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100"
          >
            Dashboard
          </h1>

          <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Monitor staff availability and current service workload.
          </p>
        </div>
      </div>

      <UButton
        color="primary"
        icon="i-heroicons-arrow-path"
        :loading="loadingSummary"
        @click="fetchDashboardSummary"
      >
        Refresh metrics
      </UButton>
    </div>

    <!-- Presence roster -->
    <UsersOnlineUsersDashboard />

    <!-- Operational snapshot -->
    <section>
      <div class="mb-4 flex items-end justify-between gap-3">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
          >
            Operational snapshot
          </p>

          <h2 class="mt-1 text-lg font-bold text-stone-900 dark:text-stone-100">
            Ticket workload
          </h2>

          <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Current workload and service requests requiring attention.
          </p>
        </div>

        <span
          class="hidden rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300 sm:inline-flex"
        >
          Updates every 30 seconds
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          label="Open Tickets"
          :value="summary.open_tickets"
          icon="i-heroicons-ticket"
          description="Open or reopened requests"
          color="primary"
        />

        <DashboardMetricCard
          label="Unassigned"
          :value="summary.unassigned_tickets"
          icon="i-heroicons-user-minus"
          description="Waiting for a technician"
          color="red"
        />

        <DashboardMetricCard
          label="Awaiting Parts"
          :value="summary.awaiting_parts"
          icon="i-heroicons-wrench-screwdriver"
          description="Pending required parts"
          color="amber"
        />

        <DashboardMetricCard
          label="Resolved Today"
          :value="summary.resolved_today"
          icon="i-heroicons-check-circle"
          description="Tickets resolved today"
          color="stone"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.orbit-container {
  position: relative;
  width: 420px;
  height: 420px;
  margin: 100px auto;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.center-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background: #00dc82;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.orbit-path {
  position: absolute;
  inset: 0;
  animation: orbit 4s linear infinite;
}

.orbiting-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  object-fit: cover;
  transform: translate(-50%, -50%) translateX(125px);
  animation: keep-upright 4s linear infinite;
}

@keyframes orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes keep-upright {
  from {
    transform: translate(-50%, -50%) translateX(125px) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) translateX(125px) rotate(-360deg);
  }
}
</style>
