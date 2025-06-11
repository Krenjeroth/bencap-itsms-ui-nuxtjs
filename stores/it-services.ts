export const useItServiceStore = defineStore("itServiceStore", () => {
  const {
    fetchItServicesApi,
    addItServiceApi,
    updateItServiceApi,
    deleteItServiceApi,
    fetchItServicesSelectApi,
  } = useItServiceApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { transformDatePickerDate } = useDateHandler();
  const { capitalizeSentences, capitalizeAll, capitalizeWords } =
    useStringHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const itServices = ref([]);

  const itServiceSelect = ref<TItServiceSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalItServices = ref(0);
  const selectedStatus = ref("");

  const fetchItServices = async () => {
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

      const response = await fetchItServicesApi(queryParams);

      itServices.value = response.data.map((item: any) => ({
        ...item,
      }));

      totalItServices.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addItService = async (form: ICreateItServiceForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeWords(form.name),
      description: capitalizeSentences(form.description),
      code: capitalizeAll(form.code),
      status: "active",
    };

    await addItServiceApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateItService = async (id: string, form: IUpdateItServiceForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeWords(form.name),
      description: capitalizeSentences(form.description),
      code: capitalizeAll(form.code),
      status: "active",
    };

    await updateItServiceApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteItService = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteItServiceApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchItServicesSelect = async () => {
    try {
      const response = await fetchItServicesSelectApi();
      itServiceSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    itServices,
    itServiceSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalItServices,
    selectedStatus,
    fetchItServices,
    addItService,
    updateItService,
    deleteItService,
    fetchItServicesSelect,
  };
});
