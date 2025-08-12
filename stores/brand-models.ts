export const useBrandModelStore = defineStore("brandModelStore", () => {
  const {
    fetchBrandModelsApi,
    addBrandModelApi,
    updateBrandModelApi,
    deleteBrandModelApi,
    fetchBrandModelSearchApi,
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

  const brandModelSelectPage = ref(1);
  const brandModelSelectHasMore = ref(true);
  const brandModelSelectLimit = 20;

  const resetBrandModelSelect = () => {
    brandModelSelect.value = [];
    brandModelSelectPage.value = 1;
    brandModelSelectHasMore.value = true;
  };

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
      item_type_id: form.item_type,
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
      item_type_id: form.item_type,
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

  const fetchBrandModelSelect = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchBrandModelSearchApi(queryParams);
      return response.data; // ✅ MUST return data!
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

  const fetchBrandModelSearch = async (q: string, item_type_id: any = null) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        item_type_id,
        limit: "50",
      });
      const response = await fetchBrandModelSearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

  return {
    brandModels,
    brandModelSelect,
    brandModelSelectHasMore,
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
    fetchBrandModelSearch,
  };
});
