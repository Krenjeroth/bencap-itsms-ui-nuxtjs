export const useInventoryItemStore = defineStore("inventoryItemStore", () => {
  const {
    fetchInventoryItemsApi,
    addInventoryItemApi,
    updateInventoryItemApi,
    deleteInventoryItemApi,
    fetchInventoryItemSearchApi,
  } = useInventoryItemApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  const { transformDatePickerDate } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const inventoryItems = ref([]);

  const inventoryItemSelect = ref<TItemSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalItems = ref(0);
  const selectedStatus = ref("");

  const fetchInventoryItems = async () => {
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

      const response = await fetchInventoryItemsApi(queryParams);

      inventoryItems.value = response.data.map((inventoryItem: any) => ({
        ...inventoryItem,
      }));

      totalItems.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addInventoryItem = async (form: ICreateInventoryItemForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      measurement_unit_id: form.measurement_unit,
      brand_model_id: form.brand_model?.id,
    };

    await addInventoryItemApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateInventoryItem = async (
    id: string,
    form: IUpdateInventoryItemForm
  ) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      measurement_unit_id: form.measurement_unit,
      brand_model_id: form.brand_model?.id,
    };

    await updateInventoryItemApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteInventoryItem = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteInventoryItemApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchInventoryItemSearch = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchInventoryItemSearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

  return {
    inventoryItems,
    inventoryItemSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalItems,
    selectedStatus,
    fetchInventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    fetchInventoryItemSearch,
  };
});
