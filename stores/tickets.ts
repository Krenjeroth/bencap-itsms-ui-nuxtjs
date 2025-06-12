export const useTicketStore = defineStore("ticketStore", () => {
  const { fetchTicketsApi, addTicketApi, updateTicketApi, deleteTicketApi } =
    useTicketApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { transformDatePickerDate } = useDateHandler();
  const { capitalizeSentences, capitalizeAll, capitalizeWords } =
    useStringHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const tickets = ref([]);

  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalTickets = ref(0);
  const selectedStatus = ref("");

  const fetchTickets = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams({
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
        sort: sort.value.column,
        order: sort.value.direction,
        search: search.value,
        ...(selectedStatus.value ? { status: selectedStatus.value } : {}),
      });

      const response = await fetchTicketsApi(queryParams);

      tickets.value = response.data.map((item: any) => ({
        ...item,
      }));

      totalTickets.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addTicket = async (form: ICreateTicketForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      status: "active",
    };

    await addTicketApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateTicket = async (id: string, form: IUpdateTicketForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      status: "active",
    };

    await updateTicketApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteTicket = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteTicketApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    tickets,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalTickets,
    selectedStatus,
    fetchTickets,
    addTicket,
    updateTicket,
    deleteTicket,
  };
});
