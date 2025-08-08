export const useInventoryApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "inventories";
  const inventoryUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const inventoriesSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const inventoriesMainAssetSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-main-asset-search");
    return url;
  });

  const fetchInventoriesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${inventoryUrl.value}?${queryParams.toString()}`
    );
  };

  const addInventoryApi = async (form: ICreateInventoryForm) => {
    return await sanctumFetch(`${inventoryUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateInventoryApi = async (id: string, form: IUpdateInventoryForm) => {
    return await sanctumFetch(`${inventoryUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteInventoryApi = async (id: string) => {
    return await sanctumFetch(`${inventoryUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchInventorySearchApi = async (queryParams?: URLSearchParams) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${inventoriesSearchUrl.value}?${queryString}`);
  };

  const fetchInventoryMainAssetSearchApi = async (
    queryParams?: URLSearchParams
  ) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(
      `${inventoriesMainAssetSearchUrl.value}?${queryString}`
    );
  };

  return {
    fetchInventoriesApi,
    addInventoryApi,
    updateInventoryApi,
    deleteInventoryApi,
    fetchInventorySearchApi,
    fetchInventoryMainAssetSearchApi,
  };
};
