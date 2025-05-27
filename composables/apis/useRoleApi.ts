export const useRoleApi = () => {
  const sanctumFetch = useSanctumClient();
  const rolesUrl = computed(() => {
    const url = new URL("http://itsms/api/roles");
    return url;
  });

  const fetchRolesApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${rolesUrl.value}?${queryParams.toString()}`);
  };

  const addRoleApi = async (form: ICreateRoleForm) => {
    return await sanctumFetch(`${rolesUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateRoleApi = async (id: string, form: IUpdateRoleForm) => {
    return await sanctumFetch(`${rolesUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteRoleApi = async (id: string) => {
    return await sanctumFetch(`${rolesUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  return {
    fetchRolesApi,
    addRoleApi,
    updateRoleApi,
    deleteRoleApi,
  };
};
