export const useDepartmentApi = () => {
  const sanctumFetch = useSanctumClient();
  const departmentsUrl = computed(() => {
    const url = new URL("http://itsms/api/departments");
    return url;
  });

  const departmentSelectUrl = computed(() => {
    const url = new URL("http://itsms/api/departments-select");
    return url;
  });

  const fetchDepartmentsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${departmentsUrl.value}?${queryParams.toString()}`
    );
  };

  const addDepartmentApi = async (form: ICreateDepartmentForm) => {
    return await sanctumFetch(`${departmentsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateDepartmentApi = async (
    id: string,
    form: IUpdateDepartmentForm
  ) => {
    return await sanctumFetch(`${departmentsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteDepartmentApi = async (id: string) => {
    return await sanctumFetch(`${departmentsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchDepartmentSelectApi = async () => {
    return await sanctumFetch(`${departmentSelectUrl.value}`);
  };

  return {
    fetchDepartmentsApi,
    addDepartmentApi,
    updateDepartmentApi,
    deleteDepartmentApi,
    fetchDepartmentSelectApi,
  };
};
