export const useOfficeApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "offices";

  const officesUrl = computed(() => apiUrl(`lookups/${moduleTitle}`));
  const officesSearchUrl = computed(() => apiUrl(`search/${moduleTitle}`));

  const fetchOfficesApi = async (queryParams?: URLSearchParams) => {
    const query = queryParams?.toString();
    return await sanctumFetch(
      query ? `${officesUrl.value}?${query}` : `${officesUrl.value}`,
    );
  };

  const fetchOfficeSearchApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${officesSearchUrl.value}?${queryParams.toString()}`,
    );
  };

  return {
    fetchOfficesApi,
    fetchOfficeSearchApi,
  };
};
