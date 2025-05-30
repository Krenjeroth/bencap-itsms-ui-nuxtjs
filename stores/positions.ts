export const usePositionStore = defineStore("positionStore", () => {
  const {
    fetchPositionsApi,
    addPositionApi,
    updatePositionApi,
    deletePositionApi,
    fetchPositionSelectApi,
  } = usePositionApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const positions = ref([]);
  const positionSelect = ref<TPositionSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalPositions = ref(0);
  const selectedStatus = ref("");

  const fetchPositions = async () => {
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

      const response = await fetchPositionsApi(queryParams);

      positions.value = response.data;
      totalPositions.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addPosition = async (form: ICreatePositionForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeAll(form.name),
      abbreviation: capitalizeAll(form.abbreviation),
    };

    await addPositionApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updatePosition = async (id: string, form: IUpdatePositionForm) => {
    loading.value = true;
    resetErrorBag();
    const formattedForm = {
      ...form,
      name: capitalizeAll(form.name),
      abbreviation: capitalizeAll(form.abbreviation),
    };
    await updatePositionApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deletePosition = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deletePositionApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchPositionSelect = async () => {
    try {
      const response = await fetchPositionSelectApi();
      positionSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    positions,
    positionSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalPositions,
    selectedStatus,
    fetchPositions,
    addPosition,
    updatePosition,
    deletePosition,
    fetchPositionSelect,
  };
});
