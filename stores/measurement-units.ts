export const useMeasurementUnitStore = defineStore(
  "measurementUnitStore",
  () => {
    const {
      fetchMeasurementUnitsApi,
      addMeasurementUnitApi,
      updateMeasurementUnitApi,
      deleteMeasurementUnitApi,
      fetchMeasurementUnitSearchApi,
      fetchMeasurementUnitSelectApi,
    } = useMeasurementUnitApi();
    const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
      useErrorHandler();
    const { capitalizeAll } = useStringHandler();
    const { transformDatePickerDate } = useDateHandler();
    enum SortDirection {
      ASC = "asc",
      DESC = "desc",
    }
    const measurementUnits = ref([]);

    const measurementUnitSelect = ref<TItemSelectOption[]>([]);
    const loading = ref(false);
    const page = ref(1);
    const pageCount = ref(5);
    const search = ref("");
    const sort = ref<{ column: string; direction: SortDirection }>({
      column: "created_at",
      direction: SortDirection.DESC,
    });
    const totalMeasurementUnits = ref(0);
    const selectedStatus = ref("");

    const fetchMeasurementUnits = async () => {
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

        const response = await fetchMeasurementUnitsApi(queryParams);

        measurementUnits.value = response.data.map((item: any) => ({
          ...item,
        }));

        totalMeasurementUnits.value = Number(response.meta.total) || 0;
      } catch (err: any) {
        throw err;
      } finally {
        loading.value = false;
      }
    };

    const addMeasurementUnit = async (form: ICreateMeasurementUnitForm) => {
      loading.value = true;
      resetErrorBag();

      const formattedForm = {
        ...form,
      };

      await addMeasurementUnitApi(formattedForm)
        .catch((err: any) => {
          transformValidationErrors(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const updateMeasurementUnit = async (
      id: string,
      form: IUpdateMeasurementUnitForm
    ) => {
      loading.value = true;
      resetErrorBag();

      const formattedForm = {
        ...form,
      };

      await updateMeasurementUnitApi(id, formattedForm)
        .catch((err: any) => {
          transformValidationErrors(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const deleteMeasurementUnit = async (id: string) => {
      loading.value = true;
      resetErrorBag();
      await deleteMeasurementUnitApi(id)
        .catch((err: any) => {
          transformValidationErrors(err);
        })
        .finally(() => {
          loading.value = false;
        });
    };

    const fetchMeasurementUnitSelect = async () => {
      try {
        const response = await fetchMeasurementUnitSelectApi();
        measurementUnitSelect.value = response.data;
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMeasurementUnitSearch = async (q: string) => {
      try {
        const queryParams = new URLSearchParams({
          q,
          limit: "50",
        });
        const response = await fetchMeasurementUnitSearchApi(queryParams);
        return response.data;
      } catch (err) {
        console.error("API Error:", err);
        return [];
      }
    };

    return {
      measurementUnits,
      measurementUnitSelect,
      loading,
      errorBag,
      hasError,
      page,
      pageCount,
      search,
      sort,
      totalMeasurementUnits,
      selectedStatus,
      fetchMeasurementUnits,
      addMeasurementUnit,
      updateMeasurementUnit,
      deleteMeasurementUnit,
      fetchMeasurementUnitSelect,
      fetchMeasurementUnitSearch,
    };
  }
);
