export const useSolutionApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "solutions";
  const solutionsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const solutionsSelectUrl = computed(() => {
    return apiUrl(`lookups/${moduleTitle}`);
  });

  const fetchSolutionsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${solutionsUrl.value}?${queryParams.toString()}`,
    );
  };

  const addSolutionApi = async (form: ICreateSolutionForm) => {
    return await sanctumFetch(`${solutionsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateSolutionApi = async (id: string, form: IUpdateSolutionForm) => {
    return await sanctumFetch(`${solutionsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteSolutionApi = async (id: string) => {
    return await sanctumFetch(`${solutionsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchSolutionSelectApi = async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    return await sanctumFetch(`${solutionsSelectUrl.value}${query}`);
  };

  const addSolutionSelectApi = async (form: ICreateSolutionForm) => {
    return await sanctumFetch(`${solutionsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  return {
    fetchSolutionsApi,
    addSolutionApi,
    updateSolutionApi,
    deleteSolutionApi,
    fetchSolutionSelectApi,
    addSolutionSelectApi,
  };
};
