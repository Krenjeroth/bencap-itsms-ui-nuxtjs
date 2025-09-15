export const useInventoryStore = defineStore("inventoryStore", () => {
  const {
    fetchInventoriesApi,
    addInventoryApi,
    updateInventoryApi,
    deleteInventoryApi,
    fetchInventorySearchApi,
    fetchInventoryMainAssetSearchApi,
  } = useInventoryApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  const { transformDatePickerDate } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const inventories = ref([]);

  const inventorySelect = ref<TInventorySelectOption[]>([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalInventories = ref(0);
  const selectedStatus = ref("");

  const fetchInventories = async () => {
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

      const response = await fetchInventoriesApi(queryParams);

      inventories.value = response.data.map((inventoryResponse: any) => ({
        ...inventoryResponse,
        actual_user: inventoryResponse.employee
          ? `${inventoryResponse.employee?.full_name}`
          : `${inventoryResponse.inventory?.employee?.full_name}`,
        component_classification: inventoryResponse.inventory
          ? `Component`
          : `Parent`,
        is_parent: inventoryResponse.inventory ? false : true,
        brand_model_formatted: inventoryResponse.brand_model
          ? inventoryResponse.brand_model?.name
            ? `${inventoryResponse.brand_model.item_type?.type} ${inventoryResponse.brand_model?.specification}, ${inventoryResponse.brand_model?.name}`
            : `${inventoryResponse.brand_model?.item_type?.type}, ${inventoryResponse.brand_model?.specification}`
          : inventoryResponse.item_type?.type,

        option_attribute: `${inventoryResponse.property_number} (${inventoryResponse.description})`,
      }));

      console.log(inventories.value);

      totalInventories.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addInventory = async (form: ICreateInventoryForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      employee_id: form.employee?.id,
      brand_model_id: form.brand_model?.id,
      item_type_id: form.item_type,
      // parent_component_id: form.inventory?.id,
      parent_component_id: form.parent_id,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,
      status: "active",
    };

    await addInventoryApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateInventory = async (id: string, form: IUpdateInventoryForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      employee_id: form.item_type === 1 ? form.employee?.id : null,
      brand_model_id: form.item_type !== 1 ? form.brand_model?.id : null,
      parent_component_id: form.item_type !== 1 ? form.inventory?.id : null,
      item_type_id: form.item_type,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,

      ip_address: form.item_type === 1 ? form.ip_address : null,
      mac_address: form.item_type === 1 ? form.mac_address : null,
      remarks: form.item_type === 1 ? form.remarks : null,

      operating_system_name:
        form.item_type === 1 ? form.operating_system_name : null,
      os_license_number: form.item_type === 1 ? form.os_license_number : null,
      anti_virus_name: form.item_type === 1 ? form.anti_virus_name : null,
      anti_virus_license_number:
        form.item_type === 1 ? form.anti_virus_license_number : null,
      microsoft_office_name:
        form.item_type === 1 ? form.microsoft_office_name : null,
      ms_office_license_number:
        form.item_type === 1 ? form.ms_office_license_number : null,
      other_installed_applications:
        form.item_type === 1 ? form.other_installed_applications : null,

      status: "active",
    };

    await updateInventoryApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteInventory = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteInventoryApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchInventorySearch = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchInventorySearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

  const fetchInventoryMainAssetSearch = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchInventoryMainAssetSearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

  return {
    inventories,
    inventorySelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalInventories,
    selectedStatus,
    fetchInventories,
    addInventory,
    updateInventory,
    deleteInventory,
    fetchInventorySearch,
    fetchInventoryMainAssetSearch,
  };
});
