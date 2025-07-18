export const useInventoryItemApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "inventory-items";
  const itemsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const itemsSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const fetchInventoryItemsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${itemsUrl.value}?${queryParams.toString()}`);
  };

  const addInventoryItemApi = async (form: ICreateInventoryItemForm) => {
    return await sanctumFetch(`${itemsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateInventoryItemApi = async (
    id: string,
    form: IUpdateInventoryItemForm
  ) => {
    return await sanctumFetch(`${itemsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteInventoryItemApi = async (id: string) => {
    return await sanctumFetch(`${itemsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchInventoryItemSearchApi = async (queryParams?: URLSearchParams) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${itemsSearchUrl.value}?${queryString}`);
  };

  return {
    fetchInventoryItemsApi,
    addInventoryItemApi,
    updateInventoryItemApi,
    deleteInventoryItemApi,
    fetchInventoryItemSearchApi,
  };
};
