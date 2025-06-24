export const useEmployeeApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "employees";
  const employeesUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const employeeSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const fetchEmployeesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${employeesUrl.value}?${queryParams.toString()}`
    );
  };

  const addEmployeeApi = async (form: ICreateEmployeeForm) => {
    return await sanctumFetch(`${employeesUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateEmployeeApi = async (id: string, form: IUpdateEmployeeForm) => {
    return await sanctumFetch(`${employeesUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteEmployeeApi = async (id: string) => {
    return await sanctumFetch(`${employeesUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchEmployeeSearchApi = async (queryParams?: URLSearchParams) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(`${employeeSearchUrl.value}?${queryString}`);
  };

  return {
    fetchEmployeesApi,
    addEmployeeApi,
    updateEmployeeApi,
    deleteEmployeeApi,
    fetchEmployeeSearchApi,
  };
};
