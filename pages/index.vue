<script setup lang="ts">
const { user } = useSanctumAuth<IUser>();

definePageMeta({
  middleware: ["sanctum:auth"],
  title: "Dashboard",
});

useHead({
  title: "Dashboard",
});
</script>

<template>
  <!-- <div class="orbit-container">
    <div class="center-point"></div>

    <div class="orbit-path">
      <img
        :src="user?.profile?.img_path"
        alt="Orbiting Image"
        class="orbiting-image"
      />
    </div>
  </div> -->

  <div>
    <h1>Dashboard</h1>

    <!-- Other dashboard content -->

    <!-- Online Users Section -->
    <UsersOnlineUsersDashboard />
  </div>
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
