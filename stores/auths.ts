export const useAuthStore = defineStore("authStore", () => {
  const { authLoginApi, fetchLoggedInUserApi, authLogoutApi } = useAuthApi();
  const { startHeartbeat, stopHeartbeat } = useUserStore();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();

  const { stopHeartbeatApi } = useUserApi();

  const loggedInUser = ref<any>(null);
  const loading = ref(false);

  const authLogin = async (form: ILoginForm) => {
    loading.value = true;
    resetErrorBag();

    await authLoginApi(form)
      .then(async () => {
        await fetchLoggedInUser();
      })
      .catch((err) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchLoggedInUser = async () => {
    loading.value = true;
    resetErrorBag();

    try {
      const response = await fetchLoggedInUserApi();

      if (response) {
        loggedInUser.value = response;

        startHeartbeat();
      }

      return response;
    } catch (err) {
      loggedInUser.value = null;
      stopHeartbeat();

      throw err;
    } finally {
      loading.value = false;
    }
  };

  const authLogout = async () => {
    loading.value = true;

    try {
      // Stop the local timer so it cannot send another heartbeat.
      stopHeartbeat();

      // Session is still valid here, so Laravel can identify the user
      // and set profiles.status to offline.
      await stopHeartbeatApi();

      // Only invalidate the Sanctum session after the status update.
      await authLogoutApi();

      loggedInUser.value = null;
    } catch (err) {
      console.error("Logout failed:", err);

      // Clear local user state even if the request fails.
      loggedInUser.value = null;

      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    errorBag,
    hasError,
    authLogin,
    fetchLoggedInUser,
    authLogout,
    loggedInUser,
  };
});
