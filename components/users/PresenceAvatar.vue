<script setup lang="ts">
interface PresenceUser {
  id: string | number;
  email: string;
  username: string;
  display_name: string | null;
  status: "online" | "offline" | "busy";
  img_path: string | null;
}

const props = defineProps<{
  user: PresenceUser;
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

const tooltipText = computed(() => {
  return `${displayName.value} — ${statusLabel.value}`;
});

const statusDotClass = computed(() => {
  const classes = {
    online: "bg-emerald-500",
    busy: "bg-amber-400",
    offline: "bg-stone-400 dark:bg-stone-500",
  };

  return classes[props.user.status] || classes.offline;
});
</script>

<template>
  <div
    class="group flex min-w-20 flex-col items-center gap-2 rounded-xl px-2 py-2 text-center transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
    :title="tooltipText"
  >
    <div class="relative">
      <img
        v-if="user.img_path"
        :src="user.img_path"
        :alt="displayName"
        class="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm dark:border-stone-800"
      />

      <div
        v-else
        class="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 text-sm font-bold text-stone-700 dark:bg-stone-700 dark:text-stone-100"
      >
        {{ initials }}
      </div>

      <!-- Presence indicator -->
      <span
        class="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-stone-50 dark:border-stone-900"
        :class="statusDotClass"
      />
    </div>

    <p
      class="max-w-20 truncate text-xs font-semibold text-stone-700 dark:text-stone-200"
    >
      {{ displayName }}
    </p>
  </div>
</template>
