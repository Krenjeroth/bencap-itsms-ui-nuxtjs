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

  const knownNotificationIds = ref<Set<string>>(new Set());
  const soundEnabled = ref(true);
  const audioUnlocked = ref(false);

  const notificationSound = import.meta.client
    ? new Audio("/audio/bruh.mp3")
    : null;

  const unlockNotificationSound = async () => {
    if (!import.meta.client || audioUnlocked.value || !notificationSound) {
      return;
    }

    try {
      notificationSound.muted = true;
      notificationSound.currentTime = 0;

      await notificationSound.play();

      notificationSound.pause();
      notificationSound.currentTime = 0;
      notificationSound.muted = false;

      audioUnlocked.value = true;
    } catch (err) {
      console.warn("Notification sound could not be unlocked.", err);
    }
  };

  const playNotificationSound = async () => {
    if (
      !import.meta.client ||
      !soundEnabled.value ||
      !audioUnlocked.value ||
      !notificationSound
    ) {
      return;
    }

    try {
      notificationSound.currentTime = 0;
      await notificationSound.play();
    } catch (err) {
      console.warn("Could not play notification sound.", err);
    }
  };

  const fetchNotifications = async () => {
    loading.value = true;

    try {
      const queryParams = new URLSearchParams({
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
      });

      const response = await fetchNotificationsApi(queryParams);

      const fetchedNotifications = response.data ?? [];

      const newlyReceived = fetchedNotifications.filter(
        (notification: any) => !knownNotificationIds.value.has(notification.id),
      );

      const shouldPlaySound =
        knownNotificationIds.value.size > 0 && newlyReceived.length > 0;

      notifications.value = fetchedNotifications;
      totalNotifications.value = Number(response.meta?.total) || 0;
      unreadCount.value = fetchedNotifications.filter(
        (notification: any) => !notification.read_at,
      ).length;

      knownNotificationIds.value = new Set(
        fetchedNotifications.map((notification: any) => notification.id),
      );

      if (shouldPlaySound) {
        await playNotificationSound();
      }
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
    stopPolling();

    fetchNotifications();

    pollTimer = setInterval(fetchNotifications, intervalMs);
  };

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
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
    soundEnabled,

    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    startPolling,
    stopPolling,
    unlockNotificationSound,
    playNotificationSound,
  };
});
