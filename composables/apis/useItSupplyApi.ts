export const useItSupplyApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "it-supplies";
  const itSuppliesUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const itSuppliesSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const fetchItSuppliesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${itSuppliesUrl.value}?${queryParams.toString()}`
    );
  };

  const addItSupplyApi = async (form: ICreateItSupplyForm) => {
    return await sanctumFetch(`${itSuppliesUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateItSupplyApi = async (id: string, form: IUpdateItSupplyForm) => {
    return await sanctumFetch(`${itSuppliesUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteItSupplyApi = async (id: string) => {
    return await sanctumFetch(`${itSuppliesUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchItSupplySearchApi = async (queryParams?: URLSearchParams) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${itSuppliesSearchUrl.value}?${queryString}`);
  };

  return {
    fetchItSuppliesApi,
    addItSupplyApi,
    updateItSupplyApi,
    deleteItSupplyApi,
    fetchItSupplySearchApi,
  };
};
