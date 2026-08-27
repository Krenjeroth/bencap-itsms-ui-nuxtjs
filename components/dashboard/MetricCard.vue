<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    value: number;
    icon: string;
    description?: string;
    color?: "primary" | "amber" | "red" | "stone";
  }>(),
  {
    description: "",
    color: "stone",
  },
);

const iconWrapperClass = computed(() => {
  const classes = {
    primary: "bg-emerald-100 dark:bg-emerald-950/60",
    amber: "bg-amber-100 dark:bg-amber-950/60",
    red: "bg-red-100 dark:bg-red-950/60",
    stone: "bg-stone-100 dark:bg-stone-700",
  };

  return classes[props.color];
});

const iconClass = computed(() => {
  const classes = {
    primary: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
    stone: "text-stone-600 dark:text-stone-300",
  };

  return classes[props.color];
});
</script>

<template>
  <article
    class="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-stone-700 dark:bg-stone-800"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-stone-500 dark:text-stone-400">
          {{ label }}
        </p>

        <p class="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-100">
          {{ value }}
        </p>
      </div>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl"
        :class="iconWrapperClass"
      >
        <UIcon :name="icon" class="h-5 w-5" :class="iconClass" />
      </div>
    </div>

    <p
      v-if="description"
      class="mt-3 text-xs text-stone-400 dark:text-stone-500"
    >
      {{ description }}
    </p>
  </article>
</template>
