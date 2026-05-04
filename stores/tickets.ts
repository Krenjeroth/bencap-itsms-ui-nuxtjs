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
  const { transformDatePickerDate, transformDateDurationHumanize } =
    useDateHandler();
  const { strConvertUnderscoreToSpace, capitalizeWord } = useStringHandler();

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
  const activeTab = ref<
    "all" | "accepted_by_me" | "accepted_by_others" | "closed"
  >("all");

  const priorities = ref([
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]);

  const formatClient = (ticket: any) => {
    const inventoryEmployee =
      ticket?.inventory?.inventory?.employee ??
      ticket?.inventory?.employee ??
      null;

    const employeeName =
      inventoryEmployee?.full_name ?? inventoryEmployee?.fullname ?? null;

    const officeCode =
      ticket?.inventory?.inventory?.employee?.office_code ??
      ticket?.inventory?.employee?.office_code ??
      null;

    if (employeeName) {
      return officeCode ? `${employeeName} (${officeCode})` : employeeName;
    }

    if (ticket?.full_name) {
      return `${ticket.full_name} (${ticket?.agency?.abbreviation})`;
    }

    return "Unknown Client";
  };

  const formatClientMeta = (ticket: any) => {
    const inventoryEmployee =
      ticket?.inventory?.inventory?.employee ??
      ticket?.inventory?.employee ??
      null;

    const departmentName =
      inventoryEmployee?.department?.abbreviation ??
      inventoryEmployee?.department?.name ??
      null;

    if (departmentName) {
      return departmentName;
    }

    if (ticket?.agency?.abbreviation) {
      return ticket.agency.abbreviation;
    }

    if (ticket?.agency?.name) {
      return ticket.agency.name;
    }

    return "";
  };

  const formatItemType = (ticket: any) => {
    if (ticket?.inventory?.brand_model) {
      return ticket.inventory.brand_model.option_attribute_description;
    }
    if (ticket?.inventory?.item_type?.type) {
      return ticket.inventory.item_type.type;
    }
    return ticket?.item_type?.type ?? "";
  };

  const fetchTickets = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.value.toString());
      queryParams.set("per_page", pageCount.value.toString());

      if (sort.value.column) {
        queryParams.set("sort", sort.value.column);
        queryParams.set("order", sort.value.direction);
      }

      if (search.value) queryParams.set("search", search.value);
      if (selectedStatus.value)
        queryParams.set("query_status", selectedStatus.value);
      if (activeTab.value && activeTab.value !== "all")
        queryParams.set("tab", activeTab.value);

      const response = await fetchTicketsApi(queryParams);

      tickets.value = response.data.map((ticket: any) => ({
        ...ticket,

        query_status_formatted: capitalizeWord(
          strConvertUnderscoreToSpace(ticket.query_status),
        ),
        request_status_formatted: capitalizeWord(
          strConvertUnderscoreToSpace(ticket.request_status),
        ),
        priority_formatted: capitalizeWord(
          strConvertUnderscoreToSpace(ticket.priority),
        ),
        date_formatted: `${transformDatePickerDate(
          ticket.date,
          "MMM DD, YYYY",
        )} (${transformDateDurationHumanize(ticket.date)})`,
        released_at_formatted: `${transformDatePickerDate(
          ticket.released_at,
          "MM/DD/YY",
        )}`,
        solution_formatted: `${
          ticket.solution
            ? ticket.solution?.description
              ? `${ticket.solution.title} — ${ticket.solution.author.display_name} \n\r\n\r` +
                ticket.solution?.description
              : `${ticket.solution.title} — ${ticket.solution.author.display_name}`
            : "None"
        }`,

        property_number: ticket.is_other_agency ? "-" : ticket.property_number,

        client: formatClient(ticket),
        client_meta: formatClientMeta(ticket),

        item_type: ticket.inventory
          ? ticket.inventory.brand_model
            ? `${ticket.inventory.brand_model.option_attribute_description}`
            : `${ticket.inventory.item_type.type}`
          : ticket.item_type.type,
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
      agency_id: form.agency?.id,
      inventory_id: form.inventory?.id,
      ticket_number: form.ticket_number,
      query_status: "queued",
      request_status: "open",
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
      employee_id: form.is_other_agency ? null : form.employee?.id,
      agency_id: form.is_other_agency ? form.agency?.id : null,
      full_name: form.is_other_agency ? form.full_name : null,
      inventory_id: form.is_other_agency ? null : form.inventory?.id,
      item_type_id: form.is_other_agency ? form.item_type : null,
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

    const formattedForm = {
      ...form,
      solution_id: form.solution?.id,
    };

    await resolveTicketApi(id, formattedForm)
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
    form: ISetTicketServiceMethodForm,
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
    form: ISetTicketReleaseDateForm,
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
    activeTab,
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
