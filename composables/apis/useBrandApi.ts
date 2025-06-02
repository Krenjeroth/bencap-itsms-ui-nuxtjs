export const useBrandApi = () => {
  const sanctumFetch = useSanctumClient();
  const brandsUrl = computed(() => {
    const url = new URL("http://itsms/api/brands");
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

  return {
    fetchBrandsApi,
    addBrandApi,
    updateBrandApi,
    deleteBrandApi,
  };
};
