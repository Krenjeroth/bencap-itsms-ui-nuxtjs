export const useBrandModelStore = defineStore("brandModelStore", () => {
  const {
    fetchBrandModelsApi,
    addBrandModelApi,
    updateBrandModelApi,
    deleteBrandModelApi,
    fetchBrandModelSelectApi,
  } = useBrandModelApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const brandModels = ref([]);

  const brandModelSelect = ref<TBrandModelSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalBrandModels = ref(0);
  const selectedStatus = ref("");

  const fetchBrandModels = async () => {
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

      const response = await fetchBrandModelsApi(queryParams);

      brandModels.value = response.data;
      totalBrandModels.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addBrandModel = async (form: ICreateBrandModelForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeAll(form.name),
      brand_id: form.brand,
      // image: form.image,
      status: "active",
    };

    await addBrandModelApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateBrandModel = async (id: string, form: IUpdateBrandModelForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeAll(form.name),
      brand_id: form.brand,
      // image: form.image,
      status: "active",
    };
    await updateBrandModelApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteBrandModel = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteBrandModelApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchBrandModelSelect = async () => {
    try {
      const response = await fetchBrandModelSelectApi();
      brandModelSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    brandModels,
    brandModelSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalBrandModels,
    selectedStatus,
    fetchBrandModels,
    addBrandModel,
    updateBrandModel,
    deleteBrandModel,
    fetchBrandModelSelect,
  };
});
