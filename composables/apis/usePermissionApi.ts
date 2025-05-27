export const usePermissionApi = () => {
  const sanctumFetch = useSanctumClient();
  const permissionsUrl = computed(() => {
    const url = new URL("http://itsms/api/permissions");
    return url;
  });

  const fetchPermissionsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${permissionsUrl.value}?${queryParams.toString()}`
    );
  };

  const addPermissionApi = async (form: ICreatePermissionForm) => {
    return await sanctumFetch(`${permissionsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updatePermissionApi = async (
    id: string,
    form: IUpdatePermissionForm
  ) => {
    return await sanctumFetch(`${permissionsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deletePermissionApi = async (id: string) => {
    return await sanctumFetch(`${permissionsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  return {
    fetchPermissionsApi,
    addPermissionApi,
    updatePermissionApi,
    deletePermissionApi,
  };
};
