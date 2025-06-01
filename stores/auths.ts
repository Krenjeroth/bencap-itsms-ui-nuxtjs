export const useAuthStore = defineStore("authStore", () => {
  const { authLoginApi } = useAuthApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();

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

  return {
    loading,
    errorBag,
    hasError,
    authLogin,
  };
});
