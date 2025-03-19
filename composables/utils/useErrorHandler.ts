export const useErrorHandler = () => {
  const errorBag: any = ref({});
  const hasError = ref(false);

  const transformValidationErrors = (response: any, handlerType = "axios") => {
    if (handlerType === "axios") {
      if (response.data.errors) {
        hasError.value = true;
        for (let key in response.data.errors) {
          errorBag.value[key] = response.data.errors[key][0];
        }
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
