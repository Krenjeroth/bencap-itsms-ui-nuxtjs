export const useBrandModelApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "brand-models";
  const brandsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const brandModelSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const fetchBrandModelsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${brandsUrl.value}?${queryParams.toString()}`);
  };

  const addBrandModelApi = async (form: ICreateBrandModelForm) => {
    return await sanctumFetch(`${brandsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateBrandModelApi = async (
    id: string,
    form: IUpdateBrandModelForm
  ) => {
    return await sanctumFetch(`${brandsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteBrandModelApi = async (id: string) => {
    return await sanctumFetch(`${brandsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchBrandModelSearchApi = async (queryParams?: URLSearchParams) => {
    console.log(queryParams?.toString(), "queryParams");
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${brandModelSearchUrl.value}?${queryString}`);
  };

  return {
    fetchBrandModelsApi,
    addBrandModelApi,
    updateBrandModelApi,
    deleteBrandModelApi,
    fetchBrandModelSearchApi,
  };
};
