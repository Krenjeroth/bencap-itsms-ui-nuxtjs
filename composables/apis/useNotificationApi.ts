export const useNotificationApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "notifications";

  const notificationsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const fetchNotificationsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${notificationsUrl.value}?${queryParams.toString()}`,
    );
  };

  const markNotificationAsReadApi = async (id: string) => {
    return await sanctumFetch(`${notificationsUrl.value}/${id}/read`, {
      method: "POST",
    });
  };

  const markAllNotificationsAsReadApi = async () => {
    return await sanctumFetch(`${notificationsUrl.value}/read-all`, {
      method: "POST",
    });
  };

  return {
    fetchNotificationsApi,
    markNotificationAsReadApi,
    markAllNotificationsAsReadApi,
  };
};
