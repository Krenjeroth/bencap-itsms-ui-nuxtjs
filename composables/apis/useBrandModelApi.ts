export const useBrandModelApi = () => {
  const sanctumFetch = useSanctumClient();
  const brandsUrl = computed(() => {
    const url = new URL("http://itsms/api/brand-models");
    return url;
  });

  const brandModelSelectUrl = computed(() => {
    const url = new URL("http://itsms/api/brand-models-select");
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

  const fetchBrandModelSelectApi = async () => {
    return await sanctumFetch(`${brandModelSelectUrl.value}`);
  };

  return {
    fetchBrandModelsApi,
    addBrandModelApi,
    updateBrandModelApi,
    deleteBrandModelApi,
    fetchBrandModelSelectApi,
  };
};
