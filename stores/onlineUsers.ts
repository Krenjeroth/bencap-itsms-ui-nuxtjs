import { defineStore } from "pinia";
import { useUserApi } from "~/composables/apis";

export const useOnlineUsersStore = defineStore("onlineUsers", () => {
  const { fetchOnlineUsersListApi } = useUserApi();

  const users = ref<OnlineUser[]>([]);
  const loading = ref(false);
  const lastFetched = ref<Date | null>(null);

  const technicalRoles = ["It Technical"];

  const fetchOnlineUsers = async () => {
    loading.value = true;

    try {
      const response = await fetchOnlineUsersListApi();

      // sanctumFetch returns the response body directly.
      users.value = Array.isArray(response) ? response : [];

      lastFetched.value = new Date();
    } catch (error) {
      console.error("Failed to fetch online users:", error);
      users.value = [];
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const getTechnicalStaff = computed(() => {
    return users.value.filter((user) =>
      user.roles?.some((role) => technicalRoles.includes(role.title)),
    );
  });

  const getNonTechnicalStaff = computed(() => {
    return users.value.filter(
      (user) =>
        !user.roles?.some((role) => technicalRoles.includes(role.title)),
    );
  });

  const getOnlineOnly = computed(() => {
    return users.value.filter((user) => user.status === "online");
  });

  const getBusyOnly = computed(() => {
    return users.value.filter((user) => user.status === "busy");
  });

  const getOfflineOnly = computed(() => {
    return users.value.filter((user) => user.status === "offline");
  });

  const onlineCount = computed(() => getOnlineOnly.value.length);
  const busyCount = computed(() => getBusyOnly.value.length);
  const offlineCount = computed(() => getOfflineOnly.value.length);

  return {
    users,
    loading,
    lastFetched,
    fetchOnlineUsers,
    getTechnicalStaff,
    getNonTechnicalStaff,
    getOnlineOnly,
    getBusyOnly,
    getOfflineOnly,
    onlineCount,
    busyCount,
    offlineCount,
  };
});
