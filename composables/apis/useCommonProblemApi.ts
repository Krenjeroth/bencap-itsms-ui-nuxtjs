export const useCommonProblemApi = () => {
  const sanctumFetch = useSanctumClient();
  const commonProblemsUrl = computed(() => {
    const url = new URL("http://itsms/api/common-problems");
    return url;
  });

  const fetchCommonProblemsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${commonProblemsUrl.value}?${queryParams.toString()}`
    );
  };

  const addCommonProblemApi = async (form: ICreateCommonProblemForm) => {
    return await sanctumFetch(`${commonProblemsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateCommonProblemApi = async (
    id: string,
    form: IUpdateCommonProblemForm
  ) => {
    return await sanctumFetch(`${commonProblemsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteCommonProblemApi = async (id: string) => {
    return await sanctumFetch(`${commonProblemsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  return {
    fetchCommonProblemsApi,
    addCommonProblemApi,
    updateCommonProblemApi,
    deleteCommonProblemApi,
  };
};
