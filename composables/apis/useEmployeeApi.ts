export const useEmployeeApi = () => {
  const sanctumFetch = useSanctumClient();
  const employeesUrl = computed(() => {
    const url = new URL("http://itsms/api/employees");
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

  // const updateEmployeeApi = async (id: string, form: IUpdateEmployeeForm) => {
  //   return await sanctumFetch(`${employeesUrl.value}/${id}`, {
  //     method: "PUT",
  //     body: form,
  //   });
  // };

  // const deleteEmployeeApi = async (id: string) => {
  //   return await sanctumFetch(`${employeesUrl.value}/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //   });
  // };

  return {
    fetchEmployeesApi,
    addEmployeeApi,
    // updateEmployeeApi,
    // deleteEmployeeApi,
  };
};
