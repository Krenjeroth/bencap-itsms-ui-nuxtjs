export const useOfficeStore = defineStore("officeStore", () => {
  const { fetchOfficesApi, fetchOfficeSearchApi } = useOfficeApi();

  const { hasError, errorBag } = useErrorHandler();

  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }

  const offices = ref<any[]>([]);
  const officeSelect = ref<any[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "office_code",
    direction: SortDirection.ASC,
  });
  const totalOffices = ref(0);

  const normalizeOfficeOption = (office: any) => ({
    id: office.id,
    abbreviation:
      office.abbreviation ?? office.office_code ?? office.office_desc,
    office_code: office.office_code ?? null,
    office_desc: office.office_desc ?? null,
    label:
      office.office_code && office.office_desc
        ? `${office.office_code} - ${office.office_desc}`
        : (office.abbreviation ?? office.office_desc ?? office.office_code),
  });

  const fetchOffices = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams({
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
        sort: sort.value.column,
        order: sort.value.direction,
        search: search.value,
      });

      const response = await fetchOfficesApi(queryParams);
      offices.value = response.data ?? [];
      totalOffices.value = Number(response.meta?.total) || 0;
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchOfficeSelect = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams({
        page: "1",
        per_page: "1000",
        sort: "office_code",
        order: "asc",
        search: "",
      });

      const response = await fetchOfficesApi(queryParams);
      officeSelect.value = (response.data ?? []).map(normalizeOfficeOption);
      return officeSelect.value;
    } catch (err) {
      console.error("Office select fetch error:", err);
      officeSelect.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchOfficeSearch = async (q: string) => {
    if (!q || q.length < 2) return [];

    try {
      const queryParams = new URLSearchParams({
        search: q,
      });

      const response = await fetchOfficeSearchApi(queryParams);
      const result = (response.data ?? response ?? []).map(
        normalizeOfficeOption,
      );
      officeSelect.value = result;
      return result;
    } catch (err) {
      console.error("Office search error:", err);
      return [];
    }
  };

  return {
    offices,
    officeSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalOffices,
    fetchOffices,
    fetchOfficeSelect,
    fetchOfficeSearch,
  };
});
