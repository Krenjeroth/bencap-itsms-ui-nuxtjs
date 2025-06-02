export const useBrandStore = defineStore("brandStore", () => {
  const { fetchBrandsApi, addBrandApi, updateBrandApi, deleteBrandApi } =
    useBrandApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const brands = ref([]);

  const brandSelect = ref<TBrandSelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalBrands = ref(0);
  const selectedStatus = ref("");

  const fetchBrands = async () => {
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

      const response = await fetchBrandsApi(queryParams);

      brands.value = response.data;
      totalBrands.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addBrand = async (form: ICreateBrandForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeAll(form.name),
    };

    await addBrandApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateBrand = async (id: string, form: IUpdateBrandForm) => {
    loading.value = true;
    resetErrorBag();
    const name = capitalizeAll(form.name);
    const formattedForm = {
      ...form,
      name,
    };
    await updateBrandApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteBrand = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteBrandApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchBrandSelect = async () => {
    try {
      // const response = await fetchBrandSelectApi();
      // brandSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    brands,
    brandSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalBrands,
    selectedStatus,
    fetchBrands,
    addBrand,
    updateBrand,
    deleteBrand,
    fetchBrandSelect,
  };
});
