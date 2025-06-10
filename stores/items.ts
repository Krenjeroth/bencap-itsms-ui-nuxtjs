export const useItemStore = defineStore("itemStore", () => {
  const {
    fetchItemsApi,
    addItemApi,
    updateItemApi,
    deleteItemApi,
    fetchItemSelectApi,
  } = useItemApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  const { transformDatePickerDate } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const items = ref([]);

  const itemSelect = ref<TItemSelectOption[]>([]);
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

  const fetchItems = async () => {
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

      const response = await fetchItemsApi(queryParams);

      items.value = response.data.map((item: any) => ({
        ...item,
        item_type_id: item.item_type.id,
        brand_model_formatted: `${item.brand_model.brand.name} ${item.brand_model.name}`,
        // item_type_formatted: `TYPE: ${item.item_type.type}\r\nClassification: ${item.item_type.classification}\r\nPurpose: ${item.item_type.purpose}`,
      }));

      totalItems.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addItem = async (form: ICreateItemForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      item_type_id: form.item_type,
      brand_model_id: form.brand_model?.id,
      date_acquired: transformDatePickerDate(
        form.date_acquired,
        "YYYY-MM-DD HH:mm:ss"
      ),
      status: "active",
    };

    await addItemApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateItem = async (id: string, form: IUpdateItemForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      item_type_id: form.item_type,
      brand_model_id: form.brand_model?.id,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,
      status: "active",
    };

    await updateItemApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteItem = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteItemApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchItemSelect = async () => {
    try {
      const response = await fetchItemSelectApi();
      itemSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    items,
    itemSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalItems,
    selectedStatus,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    fetchItemSelect,
  };
});
