export const useNotificationStore = defineStore("notificationStore", () => {
  const {
    fetchNotificationsApi,
    markNotificationAsReadApi,
    markAllNotificationsAsReadApi,
  } = useNotificationApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();

  const notifications = ref([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(20);
  const totalNotifications = ref(0);
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  const fetchNotifications = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams({
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
      });

      const response = await fetchNotificationsApi(queryParams);

      notifications.value = response.data;
      totalNotifications.value = Number(response.meta?.total) || 0;
      unreadCount.value = response.data.filter((n: any) => !n.read_at).length;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    resetErrorBag();
    await markNotificationAsReadApi(id)
      .then(() => fetchNotifications())
      .catch((err: any) => {
        transformValidationErrors(err);
      });
  };

  const markAllNotificationsAsRead = async () => {
    resetErrorBag();
    await markAllNotificationsAsReadApi()
      .then(() => fetchNotifications())
      .catch((err: any) => {
        transformValidationErrors(err);
      });
  };

  const startPolling = (intervalMs = 25000) => {
    fetchNotifications();
    pollTimer = setInterval(fetchNotifications, intervalMs);
  };

  const stopPolling = () => {
    if (pollTimer) clearInterval(pollTimer);
  };

  return {
    notifications,
    unreadCount,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    totalNotifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    startPolling,
    stopPolling,
  };
});
