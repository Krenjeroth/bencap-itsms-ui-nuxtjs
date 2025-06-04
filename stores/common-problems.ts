export const useCommonProblemStore = defineStore("commonProblemStore", () => {
  const {
    fetchCommonProblemsApi,
    addCommonProblemApi,
    updateCommonProblemApi,
    deleteCommonProblemApi,
  } = useCommonProblemApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll, capitalizeSentences } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const commonProblems = ref([]);

  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalCommonProblems = ref(0);
  const selectedStatus = ref("");

  const fetchCommonProblems = async () => {
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

      const response = await fetchCommonProblemsApi(queryParams);

      commonProblems.value = response.data;
      totalCommonProblems.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addCommonProblem = async (form: ICreateCommonProblemForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      code: capitalizeAll(form.code),
      general_term: capitalizeSentences(form.general_term),
      information: capitalizeSentences(form.information),
      item_type_id: form.item_type,
    };

    await addCommonProblemApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateCommonProblem = async (
    id: string,
    form: IUpdateCommonProblemForm
  ) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      code: capitalizeAll(form.code),
      general_term: capitalizeSentences(form.general_term),
      information: capitalizeSentences(form.information),
      item_type_id: form.item_type,
    };

    await updateCommonProblemApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteCommonProblem = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteCommonProblemApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    commonProblems,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalCommonProblems,
    selectedStatus,
    fetchCommonProblems,
    addCommonProblem,
    updateCommonProblem,
    deleteCommonProblem,
  };
});
