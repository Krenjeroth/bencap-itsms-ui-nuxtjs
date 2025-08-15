export const useAuthStore = defineStore("authStore", () => {
  const { authLoginApi, fetchLoggedInUserApi, authLogoutApi } = useAuthApi();
  const { startHeartbeat, stopHeartbeat } = useUserStore();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();

  const loggedInUser = ref<any>(null);
  const loading = ref(false);

  const authLogin = async (form: ILoginForm) => {
    loading.value = true;
    resetErrorBag();
    // await authLoginApi(form)
    //   .catch((err) => {
    //     transformValidationErrors(err);
    //   })
    //   .finally(() => {
    //     loading.value = false;
    //   });
    await authLoginApi(form)
      .then(async () => {
        await fetchLoggedInUser(); // load user data
        startHeartbeat(); // 🔹 start sending heartbeat
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
      loggedInUser.value = response;

      if (response) {
        startHeartbeat(); // ensure heartbeat runs on refresh
      }
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const authLogout = async () => {
    stopHeartbeat(); // 🔹 stop before logging out
    await authLogoutApi(); // sanctum logout
    loggedInUser.value = null;
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
