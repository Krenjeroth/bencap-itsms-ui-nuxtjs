export const useTicketApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "tickets";
  const ticketsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const ticketsSelectUrl = computed(() => {
    return apiUrl(`lookups/${moduleTitle}`);
  });

  const fetchTicketsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(`${ticketsUrl.value}?${queryParams.toString()}`);
  };

  const fetchTicketApi = async (id: string | number) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}`);
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

  const unacceptTicketApi = async (id: string) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/unaccept`, {
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
    form: ISetTicketServiceMethodForm,
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
    form: ISetTicketReleaseDateForm,
  ) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/set-release-date`, {
      method: "POST",
      body: form,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const assessTicketApi = async (id: string, form: any) => {
    return await sanctumFetch(`${ticketsUrl.value}/${id}/assess`, {
      method: "POST",
      body: form,
      headers: {
        Accept: "application/json",
      },
    });
  };

  const downloadAssessmentReportApi = async (id: string) => {
    const { apiUrl } = useUrlHandler();
    const url = apiUrl(`tickets/${id}/assessment-report`);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/pdf, application/octet-stream, application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Download failed.");
    }

    if (contentType.includes("text/html")) {
      throw new Error("Endpoint returned HTML instead of a PDF.");
    }

    const disposition = response.headers.get("content-disposition") || "";
    let filename = "assessment-report.pdf";
    const match = disposition.match(/filename[^;=\n]*=(['"]?)([^\n'"]*)\1/);
    if (match?.[2]?.trim()) filename = match[2].trim();

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
  };

  return {
    fetchTicketsApi,
    fetchTicketApi,
    addTicketApi,
    updateTicketApi,
    deleteTicketApi,
    acceptTicketApi,
    unacceptTicketApi,
    checkStockApi,
    awaitPartApi,
    resolveTicketApi,
    cancelTicketApi,
    reopenTicketApi,
    setTicketServiceMethodApi,
    setTicketReleasedDateApi,
    assessTicketApi,
    downloadAssessmentReportApi,
  };
};
