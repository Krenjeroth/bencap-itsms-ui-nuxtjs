export const useAuthStore = defineStore("authStore", () => {
  const { authLoginApi, fetchLoggedInUserApi } = useAuthApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();

  const loggedInUser = ref<any>(null);
  const loading = ref(false);

  const authLogin = async (form: ILoginForm) => {
    loading.value = true;
    resetErrorBag();
    await authLoginApi(form)
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
    } catch (err: any) {
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
    loggedInUser,
  };
});
