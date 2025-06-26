export const useTicketStore = defineStore("ticketStore", () => {
  const {
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
  } = useTicketApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { user: loggedInUser } = useSanctumAuth<IUser>();
  const {
    transformDatePickerDate,
    transformDbDate,
    transformDateDurationHumanize,
  } = useDateHandler();
  const { capitalizeSentences, strConvertUnderscoreToSpace, capitalizeWord } =
    useStringHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }

  const serviceMethodOptions = ref([
    { label: "On Site", value: "on_site" },
    { label: "Pulled Out", value: "pulled_out" },
  ]);

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

  const priorities = ref([
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]);

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

      tickets.value = response.data.map((ticket: any) => ({
        ...ticket,

        query_status_formatted: capitalizeWord(
          strConvertUnderscoreToSpace(ticket.query_status)
        ),
        request_status_formatted: capitalizeWord(
          strConvertUnderscoreToSpace(ticket.request_status)
        ),
        priority_formatted: capitalizeWord(
          strConvertUnderscoreToSpace(ticket.priority)
        ),
        date_formatted: `${transformDatePickerDate(
          ticket.date,
          "MMM DD, YYYY"
        )} (${transformDateDurationHumanize(ticket.date)})`,
        released_at_formatted: `${transformDatePickerDate(
          ticket.released_at,
          "MM/DD/YY"
        )}`,
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
      profile_id: loggedInUser.value?.profile?.id,
      employee_id: form.employee?.id,
      item_id: form.item?.id,
      ticket_number: form.ticket_number,
      query_status: "queued", // queued, checking_stock, awaiting_part, in_progress, resolved, cancelled
      request_status: "open", // open, accepted, closed
      date: transformDatePickerDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
      item_type_id: form.item_type,
      it_service_id: Number(form.it_service),
      service_method: "on_site",
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
      employee_id: form.employee?.id,
      item_id: form.item?.id,
      item_type_id: form.item_type,
      it_service_id: Number(form.it_service),
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

  const acceptTicket = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await acceptTicketApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const checkStock = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await checkStockApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const awaitPart = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await awaitPartApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const resolveTicket = async (id: string, form: IResolveTicketForm) => {
    loading.value = true;
    resetErrorBag();
    await resolveTicketApi(id, form)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const cancelTicket = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await cancelTicketApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const reopenTicket = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await reopenTicketApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const setTicketServiceMethod = async (
    id: string,
    form: ISetTicketServiceMethodForm
  ) => {
    loading.value = true;
    resetErrorBag();
    await setTicketServiceMethodApi(id, form)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const setTicketReleaseDate = async (
    id: string,
    form: ISetTicketReleaseDateForm
  ) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      released_at: form.released_at
        ? transformDatePickerDate(form.released_at, "YYYY-MM-DD HH:mm:ss")
        : null,
    };

    await setTicketReleasedDateApi(id, formattedForm)
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
    priorities,
    serviceMethodOptions,
    fetchTickets,
    addTicket,
    updateTicket,
    deleteTicket,
    acceptTicket,
    checkStock,
    awaitPart,
    resolveTicket,
    cancelTicket,
    reopenTicket,
    setTicketServiceMethod,
    setTicketReleaseDate,
  };
});
