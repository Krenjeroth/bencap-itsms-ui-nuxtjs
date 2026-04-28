export const useUserApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "users";
  const usersUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const heartbeatUrl = computed(() => {
    const url = apiUrl("me/heartbeat");
    return url;
  });

  const stopHeartbeatUrl = computed(() => {
    const url = apiUrl("me/stop-heartbeat");
    return url;
  });

  const fetchUsersApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${usersUrl.value}?${queryParams.toString()}`);
  };

  const addUserApi = async (
    form: ICreateUserForm & { offices_assigned?: any[] },
  ) => {
    const formData = new FormData();

    for (const key in form) {
      if (
        form[key as keyof typeof form] !== null &&
        form[key as keyof typeof form] !== undefined
      ) {
        if (
          key !== "offices_assigned_ids" &&
          key !== "agencies_assigned_ids" &&
          key !== "offices_assigned"
        ) {
          formData.append(key, form[key as keyof typeof form] as any);
        }
      }
    }

    if (form.offices_assigned_ids && Array.isArray(form.offices_assigned_ids)) {
      form.offices_assigned_ids.forEach((item: any) => {
        formData.append("offices_assigned_ids[]", item);
      });
    }

    if (form.offices_assigned && Array.isArray(form.offices_assigned)) {
      formData.append(
        "offices_assigned",
        JSON.stringify(form.offices_assigned),
      );
    }

    if (
      form.agencies_assigned_ids &&
      Array.isArray(form.agencies_assigned_ids)
    ) {
      form.agencies_assigned_ids.forEach((item: any) => {
        formData.append("agencies_assigned_ids[]", item);
      });
    }

    return await sanctumFetch(`${usersUrl.value}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const updateUserApi = async (
    id: string,
    form: IUpdateUserForm & { offices_assigned?: any[] },
  ) => {
    const formData = new FormData();

    for (const key in form) {
      if (
        form[key as keyof typeof form] !== null &&
        form[key as keyof typeof form] !== undefined
      ) {
        if (
          key !== "offices_assigned_ids" &&
          key !== "agencies_assigned_ids" &&
          key !== "offices_assigned"
        ) {
          formData.append(key, form[key as keyof typeof form] as any);
        }
      }
    }

    if (form.offices_assigned_ids && Array.isArray(form.offices_assigned_ids)) {
      form.offices_assigned_ids.forEach((item: any) => {
        formData.append("offices_assigned_ids[]", item);
      });
    }

    if (form.offices_assigned && Array.isArray(form.offices_assigned)) {
      formData.append(
        "offices_assigned",
        JSON.stringify(form.offices_assigned),
      );
    }

    if (
      form.agencies_assigned_ids &&
      Array.isArray(form.agencies_assigned_ids)
    ) {
      form.agencies_assigned_ids.forEach((item: any) => {
        formData.append("agencies_assigned_ids[]", item);
      });
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

  const startHeartbeatApi = async () => {
    return await sanctumFetch(`${heartbeatUrl.value}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const stopHeartbeatApi = async () => {
    return await sanctumFetch(`${stopHeartbeatUrl.value}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
      },
    });
  };

  return {
    fetchUsersApi,
    addUserApi,
    updateUserApi,
    deleteUserApi,
    startHeartbeatApi,
    stopHeartbeatApi,
  };
};
