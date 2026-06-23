export const useOtherItServiceRequestsApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "other-it-service-requests";

  const otherItServiceRequestsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const fetchOtherItServiceRequestsApi = async (
    queryParams: URLSearchParams,
  ) => {
    return await sanctumFetch(
      `${otherItServiceRequestsUrl.value}?${queryParams.toString()}`,
    );
  };

  const addOtherItServiceRequestApi = async (form: any) => {
    return await sanctumFetch(`${otherItServiceRequestsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateOtherItServiceRequestApi = async (id: string, form: any) => {
    return await sanctumFetch(`${otherItServiceRequestsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const printOtherItServiceRequestApi = async (id: string) => {
    const { apiUrl } = useUrlHandler();
    const url = apiUrl(`other-it-service-requests/${id}/print`);

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
    let filename = "other-it-service-request.pdf";
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
    fetchOtherItServiceRequestsApi,
    addOtherItServiceRequestApi,
    updateOtherItServiceRequestApi,
    printOtherItServiceRequestApi,
  };
};
