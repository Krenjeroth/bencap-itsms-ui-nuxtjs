export const useTicketApi = () => {
  const sanctumFetch = useSanctumClient();
  const ticketsUrl = computed(() => {
    const url = new URL("http://itsms/api/tickets");
    return url;
  });

  const ticketsSelectUrl = computed(() => {
    const url = new URL("http://itsms/api/tickets-select");
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

  return {
    fetchTicketsApi,
    addTicketApi,
    updateTicketApi,
    deleteTicketApi,
  };
};
