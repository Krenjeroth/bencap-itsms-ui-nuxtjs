export const useAgencyStore = defineStore("agencyStore", () => {
  const {
    fetchAgenciesApi,
    addAgencyApi,
    updateAgencyApi,
    deleteAgencyApi,
    fetchAgencySelectApi,
  } = useAgencyApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const agencies = ref([]);

  const agencySelect = ref<TAgencySelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalAgencies = ref(0);
  const selectedStatus = ref("");

  const fetchAgencies = async () => {
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

      const response = await fetchAgenciesApi(queryParams);

      agencies.value = response.data;
      totalAgencies.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addAgency = async (form: ICreateAgencyForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeAll(form.name),
    };

    await addAgencyApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateAgency = async (id: string, form: IUpdateAgencyForm) => {
    loading.value = true;
    resetErrorBag();
    const name = capitalizeAll(form.name);
    const formattedForm = {
      ...form,
      name,
    };
    await updateAgencyApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteAgency = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteAgencyApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchAgencySelect = async () => {
    try {
      const response = await fetchAgencySelectApi();
      agencySelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    agencies,
    agencySelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalAgencies,
    selectedStatus,
    fetchAgencies,
    addAgency,
    updateAgency,
    deleteAgency,
    fetchAgencySelect,
  };
});
