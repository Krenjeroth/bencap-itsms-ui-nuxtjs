export const useRoleStore = defineStore("roleStore", () => {
  const {
    fetchRolesApi,
    addRoleApi,
    updateRoleApi,
    deleteRoleApi,
    getRoleSelectApi,
  } = useRoleApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeWords } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const roles = ref([]);
  const roleSelect = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalRoles = ref(0);
  const selectedStatus = ref("");

  const fetchRoles = async () => {
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

      const response = await fetchRolesApi(queryParams);

      roles.value = response.data;
      console.log(roles.value);
      totalRoles.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addRole = async (form: ICreateRoleForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      title: capitalizeWords(form.title),
    };

    await addRoleApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateRole = async (id: string, form: IUpdateRoleForm) => {
    loading.value = true;
    resetErrorBag();
    const formattedForm = {
      title: capitalizeWords(form.title),
    };

    await updateRoleApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteRole = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteRoleApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const getRoleSelect = async () => {
    try {
      const response = await getRoleSelectApi();
      roleSelect.value = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    roles,
    roleSelect,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalRoles,
    selectedStatus,
    fetchRoles,
    addRole,
    updateRole,
    deleteRole,
    getRoleSelect,
  };
});
