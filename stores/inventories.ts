export const useInventoryStore = defineStore("inventoryStore", () => {
  const {
    fetchInventoriesApi,
    addInventoryApi,
    updateInventoryApi,
    deleteInventoryApi,
    fetchInventorySearchApi,
    fetchInventoryMainAssetSearchApi,
  } = useInventoryApi();

  const { apiUrl } = useUrlHandler();
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
  const selectedOffice = ref("");
  const selectedOfficeId = ref<string | number>("");
  const activeTab = ref<"all" | "parent_components" | "child_components">(
    "all",
  );
  const selectedItemTypeId = ref("");

  const fetchInventories = async () => {
    loading.value = true;

    try {
      const params: Record<string, any> = {
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
        sort: sort.value.column,
        order: sort.value.direction,
        search: search.value,
        ...(selectedStatus.value ? { status: selectedStatus.value } : {}),
      };

      if (selectedOfficeId.value) {
        params.office_id = String(selectedOfficeId.value);
      }

      if (selectedItemTypeId.value) {
        params.item_type = String(selectedItemTypeId.value);
      }

      if (activeTab.value && activeTab.value !== "all") {
        params.tab = activeTab.value;
      }

      const response = await fetchInventoriesApi(new URLSearchParams(params));

      inventories.value = response.data.map((inventoryResponse: any) => {
        const officeName =
          inventoryResponse.office_name ??
          inventoryResponse.inventory?.office_name ??
          null;

        const divisionName =
          inventoryResponse.division_name ??
          inventoryResponse.inventory?.division_name ??
          null;

        return {
          ...inventoryResponse,
          actual_user: inventoryResponse.employee
            ? `${inventoryResponse.employee?.fullname}`
            : `${inventoryResponse.inventory?.employee?.fullname}`,
          component_classification: inventoryResponse.inventory
            ? `Component`
            : inventoryResponse?.item_type?.is_main_inventory &&
                inventoryResponse?.item_type?.is_component
              ? `Standalone`
              : `Parent`,
          is_parent: inventoryResponse.inventory ? false : true,
          brand_model_formatted: inventoryResponse.brand_model
            ? inventoryResponse.brand_model?.name
              ? `${inventoryResponse.brand_model.item_type?.type} ${inventoryResponse.brand_model?.specification}, ${inventoryResponse.brand_model?.name}`
              : `${inventoryResponse.brand_model?.item_type?.type}, ${inventoryResponse.brand_model?.specification}`
            : inventoryResponse.item_type?.type,
          option_attribute: `${inventoryResponse.property_number} (${inventoryResponse.description})`,
          office_code:
            inventoryResponse.office_code ??
            inventoryResponse.inventory?.office_code ??
            null,
          office_name: officeName,
          division_id:
            inventoryResponse.division_id ??
            inventoryResponse.inventory?.division_id ??
            null,
          division_name: divisionName,
          item_location: divisionName
            ? `${officeName} (${divisionName})`
            : officeName,
        };
      });

      totalInventories.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addInventory = async (form: TStoreInventoryPayload) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,
      warranty_expiration_date: form.warranty_expiration_date
        ? transformDatePickerDate(
            form.warranty_expiration_date,
            "YYYY-MM-DD HH:mm:ss",
          )
        : null,
      status: form.status ?? "active",
    };

    await addInventoryApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateInventory = async (id: string, form: TUpdateInventoryPayload) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      date_acquired: form.date_acquired
        ? transformDatePickerDate(form.date_acquired, "YYYY-MM-DD HH:mm:ss")
        : null,
      warranty_expiration_date: form.warranty_expiration_date
        ? transformDatePickerDate(
            form.warranty_expiration_date,
            "YYYY-MM-DD HH:mm:ss",
          )
        : null,

      brand_model_id:
        form.item_type_id !== 1 && form.item_type_id !== 164
          ? form.brand_model_id
          : null,
      parent_component_id:
        form.item_type_id !== 12 &&
        form.item_type_id !== 17 &&
        form.item_type_id !== 171 &&
        form.item_type_id !== 1 &&
        form.item_type_id !== 164
          ? form.parent_component_id
          : null,

      ip_address:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.ip_address
          : null,
      mac_address:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.mac_address
          : null,
      remarks:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.remarks
          : null,

      operating_system_name:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.operating_system_name
          : null,
      os_license_number:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.os_license_number
          : null,
      anti_virus_name:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.anti_virus_name
          : null,
      anti_virus_license_number:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.anti_virus_license_number
          : null,
      microsoft_office_name:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.microsoft_office_name
          : null,
      ms_office_license_number:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.ms_office_license_number
          : null,
      other_installed_applications:
        form.item_type_id === 1 || form.item_type_id === 164
          ? form.other_installed_applications
          : null,

      status: form.status ?? "active",
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

  const buildReportQueryParams = (filters: {
    item_type?: number | null;
    employee?: number | null;
    office?: string | number | null;
    office_name?: string | null;
    division?: string | number | null;
    division_name?: string | null;
    status?: string | null;
  }) => {
    const queryParams = new URLSearchParams();

    if (filters.item_type) {
      queryParams.set("item_type", String(filters.item_type));
    }

    if (filters.employee) {
      queryParams.set("employee", String(filters.employee));
    }

    if (filters.office) {
      queryParams.set("office", String(filters.office));
    }

    if (filters.office_name) {
      queryParams.set("office_name", filters.office_name);
    }

    if (filters.division) {
      queryParams.set("division", String(filters.division));
    }

    if (filters.division_name) {
      queryParams.set("division_name", filters.division_name);
    }

    if (filters.status) {
      queryParams.set("status", filters.status);
    }

    return queryParams;
  };

  const buildReportUrl = (
    endpoint: "inventories/reports/pdf" | "inventories/reports/excel",
    filters: {
      item_type?: number | null;
      employee?: number | null;
      office?: string | number | null;
      office_name?: string | null;
      division?: string | number | null;
      division_name?: string | null;
      status?: string | null;
    },
  ) => {
    const queryParams = buildReportQueryParams(filters);
    const baseUrl = apiUrl(endpoint);
    const queryString = queryParams.toString();

    return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
  };

  const downloadFileFromUrl = async (url: string, fallbackFilename: string) => {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept:
          "application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Download failed.");
    }

    if (contentType.includes("text/html")) {
      const text = await response.text();
      throw new Error(
        "File endpoint returned HTML instead of a downloadable file.",
      );
    }

    // Read filename from Content-Disposition header
    const disposition = response.headers.get("content-disposition") || "";
    let filename = fallbackFilename;

    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=(['"]?)([^\n'"]*)\1/);
      if (match?.[2]?.trim()) {
        filename = match[2].trim();
      }
    }

    const blob = await response.blob();

    if (blob.size < 1000) {
      throw new Error(`Downloaded file too small (${blob.size} bytes).`);
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
  };

  const exportInventoryReportPdf = async (filters: {
    item_type?: number | null;
    employee?: number | null;
    office?: string | number | null;
    office_name?: string | null;
    division?: string | number | null;
    division_name?: string | null;
    status?: string | null;
  }) => {
    loading.value = true;

    try {
      const url = buildReportUrl("inventories/reports/pdf", filters);
      await downloadFileFromUrl(url, "Inventory-Report.pdf");
    } finally {
      loading.value = false;
    }
  };

  const exportInventoryReportExcel = async (filters: {
    item_type?: number | null;
    employee?: number | null;
    office?: string | number | null;
    status?: string | null;
  }) => {
    loading.value = true;

    try {
      const url = buildReportUrl("inventories/reports/excel", filters);
      await downloadFileFromUrl(url, "Inventory-Report.xlsx");
    } finally {
      loading.value = false;
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
    selectedOffice,
    selectedOfficeId,
    selectedItemTypeId,
    activeTab,
    fetchInventories,
    addInventory,
    updateInventory,
    deleteInventory,
    fetchInventorySearch,
    fetchInventoryMainAssetSearch,
    exportInventoryReportExcel,
    exportInventoryReportPdf,
  };
});
