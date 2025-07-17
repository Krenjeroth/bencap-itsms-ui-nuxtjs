export const useMeasurementUnitApi = () => {
  const sanctumFetch = useSanctumClient();
  const { apiUrl } = useUrlHandler();
  const moduleTitle = "measurement-units";
  const measurementUnitsUrl = computed(() => {
    const url = apiUrl(moduleTitle);
    return url;
  });

  const measurementUnitsSelectUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-select");
    return url;
  });

  const measurementUnitsSearchUrl = computed(() => {
    const url = apiUrl(moduleTitle + "-search");
    return url;
  });

  const fetchMeasurementUnitsApi = async (queryParams: URLSearchParams) => {
    return await sanctumFetch(
      `${measurementUnitsUrl.value}?${queryParams.toString()}`
    );
  };

  const addMeasurementUnitApi = async (form: ICreateMeasurementUnitForm) => {
    return await sanctumFetch(`${measurementUnitsUrl.value}`, {
      method: "POST",
      body: form,
    });
  };

  const updateMeasurementUnitApi = async (
    id: string,
    form: IUpdateMeasurementUnitForm
  ) => {
    return await sanctumFetch(`${measurementUnitsUrl.value}/${id}`, {
      method: "PUT",
      body: form,
    });
  };

  const deleteMeasurementUnitApi = async (id: string) => {
    return await sanctumFetch(`${measurementUnitsUrl.value}/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    });
  };

  const fetchMeasurementUnitSelectApi = async () => {
    return await sanctumFetch(`${measurementUnitsSelectUrl.value}`);
  };

  const fetchMeasurementUnitSearchApi = async (
    queryParams?: URLSearchParams
  ) => {
    const queryString = queryParams?.toString() || "";
    return await sanctumFetch(
      `${measurementUnitsSearchUrl.value}?${queryString}`
    );
  };

  return {
    fetchMeasurementUnitsApi,
    addMeasurementUnitApi,
    updateMeasurementUnitApi,
    deleteMeasurementUnitApi,
    fetchMeasurementUnitSearchApi,
    fetchMeasurementUnitSelectApi,
  };
};
