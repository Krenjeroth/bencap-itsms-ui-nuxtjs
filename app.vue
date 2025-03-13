<script setup>
const title = "ITSMS";
const description = "Information Technology Services Management System.";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${title}` : title;
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UModals />
  <UNotifications />
</template>
