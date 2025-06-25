export const useTicketApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "tickets";
  const ticketsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const ticketsSelectUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-select");
    return url;
  });

  const fetchTicketsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${ticketsUrl.value}?${queryParams.toString()}`);
  };

  const addTicketApi = async (form: ICreateTicketForm) => {
    return await sanctumFetch(`${ticketsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateTicketApi = async (id: string, form: IUpdateTicketForm) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteTicketApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const acceptTicketApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/accept`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const checkStockApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/check-stock`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const awaitPartApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/await-part`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const resolveTicketApi = async (id: string, form: IResolveTicketForm) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/resolve`, {
      method: "POST",
      body: form,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const cancelTicketApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/cancel`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const reopenTicketApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/reopen`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const setTicketServiceMethodApi = async (
    id: string,
    form: ISetTicketServiceMethodForm
  ) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/set-service-method`, {
      method: "POST",
      body: form,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const setTicketReleasedDateApi = async (
    id: string,
    form: ISetTicketReleaseDateForm
  ) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/set-release-date`, {
      method: "POST",
      body: form,
      headers: {
        Accept: "application/json",
      },
    });
  };

  return {
    fetchTicketsApi,
    addTicketApi,
    updateTicketApi,
    deleteTicketApi,
    acceptTicketApi,
    checkStockApi,
    awaitPartApi,
    resolveTicketApi,
    cancelTicketApi,
    reopenTicketApi,
    setTicketServiceMethodApi,
    setTicketReleasedDateApi,
  };
};
