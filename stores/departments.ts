export const useDepartmentStore = defineStore("departmentStore", () => {
  const {
    fetchDepartmentsApi,
    addDepartmentApi,
    updateDepartmentApi,
    deleteDepartmentApi,
  } = useDepartmentApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeWords, capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const departments = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalDepartments = ref(0);
  const selectedStatus = ref("");

  const fetchDepartments = async () => {
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

      const response = await fetchDepartmentsApi(queryParams);

      departments.value = response.data;
      totalDepartments.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addDepartment = async (form: ICreateDepartmentForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      name: capitalizeWords(form.name),
      full_name: capitalizeWords(form.full_name),
      division: capitalizeWords(form.division),
      abbreviation: capitalizeAll(form.abbreviation),
    };

    await addDepartmentApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateDepartment = async (id: string, form: IUpdateDepartmentForm) => {
    loading.value = true;
    resetErrorBag();
    const name = capitalizeWords(form.name);
    const formattedForm = {
      ...form,
      name,
    };
    await updateDepartmentApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteDepartment = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteDepartmentApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    departments,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalDepartments,
    selectedStatus,
    fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
});
