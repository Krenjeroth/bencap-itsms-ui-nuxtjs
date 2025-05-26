export const useDepartmentApi = () => {
  const sanctumFetch = useSanctumClient();
  const departmentsUrl = computed(() => {
    const url = new URL("http://itsms/api/departments");
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

  // const updateUserApi = async (id: string, form: IUpdateUserForm) => {
  //   return await sanctumFetch(`${usersUrl.value}/${id}`, {
  //     method: "PUT",
  //     body: form,
  //   });
  // };

  return { fetchDepartmentsApi, addDepartmentApi };
};
