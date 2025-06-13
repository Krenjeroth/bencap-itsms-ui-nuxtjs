export const useItemApi = () => {
  const sanctumFetch = useSanctumClient();
  const itemsUrl = computed(() => {
    const url = new URL("http://itsms/api/items");
    return url;
  });

  const itemsSearchUrl = computed(() => {
    const url = new URL("http://itsms/api/items-search");
    return url;
  });

  const fetchItemsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${itemsUrl.value}?${queryParams.toString()}`);
  };

  const addItemApi = async (form: ICreateItemForm) => {
    return await sanctumFetch(`${itemsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateItemApi = async (id: string, form: IUpdateItemForm) => {
    return await sanctumFetch(`${itemsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteItemApi = async (id: string) => {
    return await sanctumFetch(`${itemsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchItemSearchApi = async (queryParams?: URLSearchParams) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${itemsSearchUrl.value}?${queryString}`);
  };

  return {
    fetchItemsApi,
    addItemApi,
    updateItemApi,
    deleteItemApi,
    fetchItemSearchApi,
  };
};
