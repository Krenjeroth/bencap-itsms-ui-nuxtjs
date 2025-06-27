export const useSolutionStore = defineStore("solutionStore", () => {
  const {
    fetchSolutionsApi,
    addSolutionApi,
    updateSolutionApi,
    deleteSolutionApi,
    fetchSolutionSelectApi,
    addSolutionSelectApi,
  } = useSolutionApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeWords, capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const solutions = ref([]);
  const solutionSelect = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalSolutions = ref(0);
  const selectedStatus = ref("");

  const fetchSolutions = async () => {
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

      const response = await fetchSolutionsApi(queryParams);

      solutions.value = response.data;
      totalSolutions.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addSolution = async (form: ICreateSolutionForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      description: capitalizeWords(form.description),
    };

    // console.log("Solutions Store", formattedForm);

    await addSolutionApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateSolution = async (id: string, form: IUpdateSolutionForm) => {
    loading.value = true;
    resetErrorBag();
    const formattedForm = {
      ...form,
      description: capitalizeWords(form.description),
    };

    await updateSolutionApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteSolution = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteSolutionApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchSolutionSelect = async () => {
    try {
      const response = await fetchSolutionSelectApi();
      solutionSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const addSolutionSelect = async (form: ICreateSolutionForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      description: capitalizeAll(form.description),
    };

    console.log("Solutions Store", form, formattedForm);

    try {
      const newSolution = await addSolutionApi(formattedForm);
      return newSolution; // ✅ return new solution
    } catch (err) {
      transformValidationErrors(err);
      throw err;
    } finally {
      loading.value = false;
    }

    // await addSolutionSelectApi(formattedForm)
    //   .catch((err: any) => {
    //     transformValidationErrors(err);
    //   })
    //   .finally(() => {
    //     loading.value = false;
    //   });
  };

  return {
    solutions,
    solutionSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalSolutions,
    selectedStatus,
    fetchSolutions,
    addSolution,
    updateSolution,
    deleteSolution,
    fetchSolutionSelect,
    addSolutionSelect,
  };
});
