export const usePositionApi = () => {
  const sanctumFetch = useSanctumClient();
  const positionsUrl = computed(() => {
    const url = new URL("http://itsms/api/positions");
    return url;
  });

  const fetchPositionsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${positionsUrl.value}?${queryParams.toString()}`
    );
  };

  const addPositionApi = async (form: ICreatePositionForm) => {
    return await sanctumFetch(`${positionsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updatePositionApi = async (id: string, form: IUpdatePositionForm) => {
    return await sanctumFetch(`${positionsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deletePositionApi = async (id: string) => {
    return await sanctumFetch(`${positionsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  return {
    fetchPositionsApi,
    addPositionApi,
    updatePositionApi,
    deletePositionApi,
  };
};
