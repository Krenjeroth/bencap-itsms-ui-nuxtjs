export const useErrorHandler = () => {
  const errorBag: any = ref({});
  const hasError = ref(false);

  const transformValidationErrors = (response: any, handlerType = "axios") => {
    resetErrorBag();
    const data = response?.response?.data || response?.data;
    if (handlerType === "axios") {
      if (data?.errors) {
        hasError.value = true;
        for (let key in data.errors) {
          errorBag.value[key] = data.errors[key][0];
        }
      } else if (data?.message) {
        hasError.value = true;
        errorBag.value.general = data.message;
      }
    }
  };

  const resetErrorBag = () => {
    errorBag.value = {};
    hasError.value = false;
  };

  return {
    errorBag,
    transformValidationErrors,
    resetErrorBag,
    hasError,
  };
};
