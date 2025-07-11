export const useAgencyApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "agencies";
  const agenciesUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const agencySelectUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-select");
    return url;
  });

  const agencySearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const fetchAgenciesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${agenciesUrl.value}?${queryParams.toString()}`);
  };

  const addAgencyApi = async (form: ICreateAgencyForm) => {
    return await sanctumFetch(`${agenciesUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateAgencyApi = async (id: string, form: IUpdateAgencyForm) => {
    return await sanctumFetch(`${agenciesUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteAgencyApi = async (id: string) => {
    return await sanctumFetch(`${agenciesUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchAgencySelectApi = async () => {
    return await sanctumFetch(`${agencySelectUrl.value}`);
  };

  const fetchAgencySearchApi = async (queryParams?: URLSearchParams) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${agencySearchUrl.value}?${queryString}`);
  };

  return {
    fetchAgenciesApi,
    addAgencyApi,
    updateAgencyApi,
    deleteAgencyApi,
    fetchAgencySelectApi,
    fetchAgencySearchApi,
  };
};
