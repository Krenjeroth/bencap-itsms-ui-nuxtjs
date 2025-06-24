export const useUrlHandler = () => {
  const config = useRuntimeConfig();
  const { lowerCaseAll } = useStringHandler();

  const baseUrl = computed(() => {
    return config.public.sanctum.baseUrl;
  });

  const apiUrl = (moduleTitle: string) => {
    return new URL(`${baseUrl.value}/api/${lowerCaseAll(moduleTitle)}`);
  };

  return {
    baseUrl,
    apiUrl,
  };
};
