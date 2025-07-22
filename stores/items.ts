export const useItemStore = defineStore("itemStore", () => {
  const {
    fetchItemsApi,
    addItemApi,
    updateItemApi,
    deleteItemApi,
    fetchItemSearchApi,
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
        brand_model_formatted: `${item.inventory_item.brand_model.brand.name} ${item.inventory_item.brand_model.name}`,
        // inventory_item_formatted: `${
        //   item.inventory_item.brand_model.item_type.type
        // }, ${
        //   item.inventory_item.description
        //     ? `${item.inventory_item.description}, ${item.inventory_item.brand_model.brand.name} ${item.inventory_item.brand_model.name}`
        //     : `${item.inventory_item.brand_model.brand.name} ${item.inventory_item.brand_model.name}`
        // }`,
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
      employee_id: form.employee?.id,
      // brand_model_id: form.brand_model?.id,
      inventory_item_id: form.inventory_item?.id,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,
      date_issued: form.date_issued
        ? transformDatePickerDate(form.date_issued, "YYYY-MM-DD HH:mm:ss")
        : null,
      date_accepted: form.date_accepted
        ? transformDatePickerDate(form.date_accepted, "YYYY-MM-DD HH:mm:ss")
        : null,
      date_installed: form.date_installed
        ? transformDatePickerDate(form.date_installed, "YYYY-MM-DD HH:mm:ss")
        : null,
      status: "active",
    };

    console.log(formattedForm);

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
      employee_id: form.employee?.id,
      // brand_model_id: form.brand_model?.id,
      inventory_item_id: form.inventory_item?.id,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,
      date_issued: form.date_issued
        ? transformDatePickerDate(form.date_issued, "YYYY-MM-DD HH:mm:ss")
        : null,
      date_accepted: form.date_accepted
        ? transformDatePickerDate(form.date_accepted, "YYYY-MM-DD HH:mm:ss")
        : null,
      date_installed: form.date_installed
        ? transformDatePickerDate(form.date_installed, "YYYY-MM-DD HH:mm:ss")
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

  const fetchItemSearch = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchItemSearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
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
    fetchItemSearch,
  };
});
