export const useUserStore = defineStore("userStore", () => {
  const { fetchUsersApi, addUserApi, updateUserApi, deleteUserApi } =
    useUserApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeWords } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const users = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalUsers = ref(0);
  const selectedStatus = ref("");

  const fetchUsers = async () => {
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

      const response = await fetchUsersApi(queryParams);

      users.value = response.data.map((user: any) => ({
        ...user,
        role_id: user.roles.map((role: any) => role.id)[0], // might change if enable multiple roles for a user
        role: user.roles.map((role: any) => role.title)[0], // might change if enable multiple roles for a user
      }));

      totalUsers.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addUser = async (form: ICreateUserForm) => {
    loading.value = true;
    resetErrorBag();
    await addUserApi(form)
      .catch((err) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateUser = async (id: string, form: IUpdateUserForm) => {
    loading.value = true;
    resetErrorBag();
    const name = capitalizeWords(form.name);
    const formattedForm = {
      ...form,
      name,
    };
    await updateUserApi(id, formattedForm)
      .catch((err) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteUser = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteUserApi(id)
      .catch((err) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    users,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalUsers,
    selectedStatus,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
});
