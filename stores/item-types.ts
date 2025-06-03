export const useItemTypeStore = defineStore("itemTypeStore", () => {
  const {
    fetchItemTypesApi,
    addItemTypeApi,
    updateItemTypeApi,
    deleteItemTypeApi,
    fetchItemTypeSelectApi,
  } = useItemTypeApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const itemTypes = ref([]);

  const itemTypeSelect = ref<TItemTypeSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalItemTypes = ref(0);
  const selectedStatus = ref("");

  const fetchItemTypes = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams({
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
        sort: sort.value.column,
        order: sort.value.direction,
        search: search.value,
        ...(selectedStatus.value
          ? { classification: selectedStatus.value }
          : {}),
      });

      const response = await fetchItemTypesApi(queryParams);

      itemTypes.value = response.data;
      totalItemTypes.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addItemType = async (form: ICreateItemTypeForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      type: capitalizeAll(form.type),
      classification: capitalizeAll(form.classification),
      purpose: capitalizeAll(form.purpose),
      status: "active",
    };

    await addItemTypeApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateItemType = async (id: string, form: IUpdateItemTypeForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      type: capitalizeAll(form.type),
      classification: capitalizeAll(form.classification),
      purpose: capitalizeAll(form.purpose),
      status: "active",
    };

    await updateItemTypeApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteItemType = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteItemTypeApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchItemTypeSelect = async () => {
    try {
      const response = await fetchItemTypeSelectApi();
      itemTypeSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    itemTypes,
    itemTypeSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalItemTypes,
    selectedStatus,
    fetchItemTypes,
    addItemType,
    updateItemType,
    deleteItemType,
    fetchItemTypeSelect,
  };
});
