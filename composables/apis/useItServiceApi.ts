export const useItServiceApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "it-services";
  const itServicesUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const itServicesSelectUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-select");
    return url;
  });

  const fetchItServicesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${itServicesUrl.value}?${queryParams.toString()}`
    );
  };

  const addItServiceApi = async (form: ICreateItServiceForm) => {
    return await sanctumFetch(`${itServicesUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateItServiceApi = async (id: string, form: IUpdateItServiceForm) => {
    return await sanctumFetch(`${itServicesUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteItServiceApi = async (id: string) => {
    return await sanctumFetch(`${itServicesUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchItServicesSelectApi = async () => {
    return await sanctumFetch(`${itServicesSelectUrl.value}`);
  };

  return {
    fetchItServicesApi,
    addItServiceApi,
    updateItServiceApi,
    deleteItServiceApi,
    fetchItServicesSelectApi,
  };
};
