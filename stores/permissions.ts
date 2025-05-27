export const usePermissionStore = defineStore("permissionStore", () => {
  const {
    fetchPermissionsApi,
    addPermissionApi,
    updatePermissionApi,
    deletePermissionApi,
  } = usePermissionApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { strConvertSpaceToUnderscore } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const permissions = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalPermissions = ref(0);
  const selectedStatus = ref("");

  const fetchPermissions = async () => {
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

      const response = await fetchPermissionsApi(queryParams);

      permissions.value = response.data;
      totalPermissions.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addPermission = async (form: ICreatePermissionForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      title: strConvertSpaceToUnderscore(form.title),
    };

    await addPermissionApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updatePermission = async (id: string, form: IUpdatePermissionForm) => {
    loading.value = true;
    resetErrorBag();
    const formattedForm = {
      title: strConvertSpaceToUnderscore(form.title),
    };

    await updatePermissionApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deletePermission = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deletePermissionApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    permissions,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalPermissions,
    selectedStatus,
    fetchPermissions,
    addPermission,
    updatePermission,
    deletePermission,
  };
});
