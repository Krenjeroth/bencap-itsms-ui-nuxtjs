export const useUserApi = () => {
  const sanctumFetch = useSanctumClient();
  const usersUrl = computed(() => {
    const url = new URL("http://itsms/api/users");
    return url;
  });

  const fetchUsersApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${usersUrl.value}?${queryParams.toString()}`);
  };

  // const addUserApi = async (form: ICreateUserForm) => {
  //   return await sanctumFetch(`${usersUrl.value}`, {
  //     method: "POST",
  //     body: form,
  //   });
  // };

  // const updateUserApi = async (id: string, form: IUpdateUserForm) => {
  //   return await sanctumFetch(`${usersUrl.value}/${id}`, {
  //     method: "PUT",
  //     body: form,
  //   });
  // };

  return { fetchUsersApi };
};
