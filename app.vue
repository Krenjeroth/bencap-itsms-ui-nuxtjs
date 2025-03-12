<script setup>
const title =
  "Benguet Capitol Information Technology Services Management System";
const description =
  "Benguet Capitol Information Technology Services Management System Description.";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${title}` : title;
  },
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UModals />
    <UNotifications />
  </div>
</template>
