export const useItemTypeApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "item-types";
  const itemTypesUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const itemTypesSelectUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-select");
    return url;
  });

  const fetchItemTypesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${itemTypesUrl.value}?${queryParams.toString()}`
    );
  };

  const addItemTypeApi = async (form: ICreateItemTypeForm) => {
    return await sanctumFetch(`${itemTypesUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateItemTypeApi = async (id: string, form: IUpdateItemTypeForm) => {
    return await sanctumFetch(`${itemTypesUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteItemTypeApi = async (id: string) => {
    return await sanctumFetch(`${itemTypesUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchItemTypeSelectApi = async () => {
    return await sanctumFetch(`${itemTypesSelectUrl.value}`);
  };

  return {
    fetchItemTypesApi,
    addItemTypeApi,
    updateItemTypeApi,
    deleteItemTypeApi,
    fetchItemTypeSelectApi,
  };
};
