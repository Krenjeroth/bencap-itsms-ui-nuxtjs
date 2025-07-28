export const useUserApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "users";
  const usersUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const fetchUsersApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${usersUrl.value}?${queryParams.toString()}`);
  };

  const addUserApi = async (form: ICreateUserForm) => {
    const formData = new FormData();

    for (const key in form) {
      if (
        form[key as keyof ICreateUserForm] !== null &&
        form[key as keyof ICreateUserForm] !== undefined
      ) {
        formData.append(key, form[key as keyof ICreateUserForm] as any);
      }
    }

    return await sanctumFetch(`${usersUrl.value}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const updateUserApi = async (id: string, form: IUpdateUserForm) => {
    const formData = new FormData();

    for (const key in form) {
      if (
        form[key as keyof IUpdateUserForm] !== null &&
        form[key as keyof IUpdateUserForm] !== undefined
      ) {
        formData.append(key, form[key as keyof IUpdateUserForm] as any);
      }
    }

    return await sanctumFetch(`${usersUrl.value}/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const deleteUserApi = async (id: string) => {
    return await sanctumFetch(`${usersUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  return { fetchUsersApi, addUserApi, updateUserApi, deleteUserApi };
};
