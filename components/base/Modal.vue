<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  onClose: {
    type: Function as PropType<IModalClose>,
    default: null,
  },
});
</script>

<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="onClose"
          />
        </div>
      </template>
      <slot />
    </UCard>
  </UModal>
</template>
