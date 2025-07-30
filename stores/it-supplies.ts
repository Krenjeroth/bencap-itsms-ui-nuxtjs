export const useItSupplyStore = defineStore("itSupplyStore", () => {
  const {
    fetchItSuppliesApi,
    addItSupplyApi,
    updateItSupplyApi,
    deleteItSupplyApi,
    fetchItSupplySearchApi,
  } = useItSupplyApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  const { transformDatePickerDate } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const itSupplies = ref([]);

  const itSupplySelect = ref<TItemSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalItSupplies = ref(0);
  const selectedStatus = ref("");

  const fetchItSupplies = async () => {
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

      const response = await fetchItSuppliesApi(queryParams);

      itSupplies.value = response.data.map((itSupply: any) => ({
        ...itSupply,
      }));

      totalItSupplies.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addItSupply = async (form: ICreateItSupplyForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      measurement_unit_id: form.measurement_unit,
      brand_model_id: form.brand_model?.id,
    };

    await addItSupplyApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateItSupply = async (id: string, form: IUpdateItSupplyForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      measurement_unit_id: form.measurement_unit,
      brand_model_id: form.brand_model?.id,
    };

    await updateItSupplyApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteItSupply = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteItSupplyApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchItSupplySearch = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchItSupplySearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

  return {
    itSupplies,
    itSupplySelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalItSupplies,
    selectedStatus,
    fetchItSupplies,
    addItSupply,
    updateItSupply,
    deleteItSupply,
    fetchItSupplySearch,
  };
});
