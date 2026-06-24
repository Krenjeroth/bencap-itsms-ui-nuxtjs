export const useOtherItServiceRequestsStore = defineStore(
  "otherItServiceRequestsStore",
  () => {
    const {
      fetchOtherItServiceRequestsApi,
      addOtherItServiceRequestApi,
      updateOtherItServiceRequestApi,
      printOtherItServiceRequestApi,
    } = useOtherItServiceRequestsApi();

    const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
      useErrorHandler();
    const { transformDatePickerDate, transformDateDurationHumanize } =
      useDateHandler();
    const { strConvertUnderscoreToSpace, capitalizeWord } = useStringHandler();

    enum SortDirection {
      ASC = "asc",
      DESC = "desc",
    }

    const requests = ref([]);
    const loading = ref(false);
    const page = ref(1);
    const pageCount = ref(5);
    const search = ref("");
    const sort = ref<{ column: string; direction: SortDirection }>({
      column: "created_at",
      direction: SortDirection.DESC,
    });
    const totalRequests = ref(0);

    const fetchRequests = async () => {
      loading.value = true;

      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", page.value.toString());
        queryParams.set("per_page", pageCount.value.toString());

        if (sort.value.column) {
          queryParams.set("sort", sort.value.column);
          queryParams.set("order", sort.value.direction);
        }

        if (search.value) queryParams.set("search", search.value);

        const response = await fetchOtherItServiceRequestsApi(queryParams);

        requests.value = response.data.map((request: any) => ({
          ...request,
          date_of_request_formatted: request.date_of_request
            ? `${transformDatePickerDate(
                request.date_of_request,
                "MMM DD, YYYY",
              )} (${transformDateDurationHumanize(request.date_of_request)})`
            : "-",
          status_formatted: capitalizeWord(
            strConvertUnderscoreToSpace(request.status),
          ),
        }));

        totalRequests.value = Number(response.meta.total) || 0;
      } catch (err: any) {
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const addRequest = async (form: any) => {
      loading.value = true;
      resetErrorBag();

      await addOtherItServiceRequestApi(form)
        .catch((err: any) => {
          transformValidationErrors(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const updateRequest = async (id: string, form: any) => {
      loading.value = true;
      resetErrorBag();

      await updateOtherItServiceRequestApi(id, form)
        .catch((err: any) => {
          transformValidationErrors(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const printRequest = async (id: string) => {
      loading.value = true;

      try {
        await printOtherItServiceRequestApi(id);
      } finally {
        loading.value = false;
      }
    };

    return {
      requests,
      loading,
      errorBag,
      hasError,
      page,
      pageCount,
      search,
      sort,
      totalRequests,
      fetchRequests,
      addRequest,
      updateRequest,
      printRequest,
    };
  },
);
