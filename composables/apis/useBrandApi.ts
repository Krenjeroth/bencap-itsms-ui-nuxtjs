export const useBrandApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "brands";
  const brandsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const brandSelectUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-select");
    return url;
  });

  const fetchBrandsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${brandsUrl.value}?${queryParams.toString()}`);
  };

  const addBrandApi = async (form: ICreateBrandForm) => {
    return await sanctumFetch(`${brandsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateBrandApi = async (id: string, form: IUpdateBrandForm) => {
    return await sanctumFetch(`${brandsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteBrandApi = async (id: string) => {
    return await sanctumFetch(`${brandsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchBrandSelectApi = async () => {
    return await sanctumFetch(`${brandSelectUrl.value}`);
  };

  return {
    fetchBrandsApi,
    addBrandApi,
    updateBrandApi,
    deleteBrandApi,
    fetchBrandSelectApi,
  };
};
