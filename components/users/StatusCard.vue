<template>
  <article
    class="group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    :class="cardClass"
  >
    <!-- Status accent -->
    <div class="absolute inset-x-0 top-0 h-1" :class="accentClass" />

    <div class="flex items-start gap-4">
      <!-- Avatar -->
      <div class="relative shrink-0">
        <img
          v-if="user.img_path"
          :src="user.img_path"
          :alt="displayName"
          class="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-sm dark:border-slate-800"
        />

        <div
          v-else
          class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-base font-bold text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-100"
        >
          {{ initials }}
        </div>

        <!-- Presence indicator -->
        <span
          class="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-[3px] border-white shadow-sm dark:border-slate-800"
          :class="statusDotClass"
          :title="statusLabel"
        />
      </div>

      <!-- User details -->
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3
              class="truncate text-sm font-bold text-slate-900 dark:text-slate-100"
            >
              {{ displayName }}
            </h3>

            <p
              class="mt-0.5 truncate text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              {{ user.designation || "No designation" }}
            </p>
          </div>

          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
            :class="statusBadgeClass"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
            {{ statusLabel }}
          </span>
        </div>

        <!-- User-defined message, for example: assisting a client -->
        <p
          v-if="user.status_text"
          class="mt-3 truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600 dark:bg-slate-700/70 dark:text-slate-300"
          :title="user.status_text"
        >
          {{ user.status_text }}
        </p>

        <!-- Footer -->
        <div
          class="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-700"
        >
          <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
            {{ activityText }}
          </span>

          <span
            class="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300"
          >
            {{ user.username || "User" }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface OnlineUser {
  id: string | number;
  email: string;
  username: string;
  display_name: string | null;
  designation: string | null;
  status: "online" | "offline" | "busy";
  status_text: string | null;
  last_seen_at: string | null;
  last_seen_at_humanized: string | null;
  img_path: string | null;
}

const props = defineProps<{
  user: OnlineUser;
}>();

const displayName = computed(() => {
  return props.user.display_name || props.user.username || props.user.email;
});

const initials = computed(() => {
  return displayName.value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
});

const statusLabel = computed(() => {
  const labels = {
    online: "Online",
    busy: "Busy",
    offline: "Offline",
  };

  return labels[props.user.status] || "Offline";
});

const activityText = computed(() => {
  if (props.user.status === "online") {
    return "Active now";
  }

  if (props.user.status === "busy") {
    return "Currently busy";
  }

  return props.user.last_seen_at_humanized
    ? `Last seen ${props.user.last_seen_at_humanized}`
    : "No recent activity";
});

const cardClass = computed(() => {
  const classes = {
    online:
      "border-emerald-200 bg-white hover:border-emerald-300 dark:border-emerald-900/70 dark:bg-stone-800 dark:hover:border-emerald-700",
    busy: "border-amber-200 bg-white hover:border-amber-300 dark:border-amber-900/70 dark:bg-stone-800 dark:hover:border-amber-700",
    offline:
      "border-stone-200 bg-white hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-stone-600",
  };

  return classes[props.user.status] || classes.offline;
});

const accentClass = computed(() => {
  const classes = {
    online: "bg-emerald-500",
    busy: "bg-amber-400",
    offline: "bg-stone-300 dark:bg-stone-600",
  };

  return classes[props.user.status] || classes.offline;
});

const statusDotClass = computed(() => {
  const classes = {
    online: "bg-emerald-500",
    busy: "bg-amber-400",
    offline: "bg-stone-400 dark:bg-stone-500",
  };

  return classes[props.user.status] || classes.offline;
});

const statusBadgeClass = computed(() => {
  const classes = {
    online:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    busy: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    offline:
      "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300",
  };

  return classes[props.user.status] || classes.offline;
});
</script>
