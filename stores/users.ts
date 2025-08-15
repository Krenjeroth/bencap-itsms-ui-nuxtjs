export const useUserStore = defineStore("userStore", () => {
  const {
    fetchUsersApi,
    addUserApi,
    updateUserApi,
    deleteUserApi,
    startHeartbeatApi,
  } = useUserApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeWords, capitalizeAll, strSanitize } = useStringHandler();
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

  const genderOptions = ref([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const WITH_DOT_PREFIX = [
    "mr",
    "ms",
    "mrs",
    "dr",
    "prof",
    "mx",
    "atty",
    "engr",
    "hon",
  ];
  const WITH_DOT_SUFFIX = ["jr", "sr"];

  const heartbeatInterval = ref<number | null>(null);

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
    const name_prefix = form.prefix
      ? WITH_DOT_PREFIX.includes(form.prefix.toLowerCase())
        ? capitalizeWords(form.prefix).concat(". ")
        : capitalizeWords(form.prefix).concat(" ")
      : null;

    const name_suffix = form.suffix
      ? WITH_DOT_SUFFIX.includes(form.suffix.toLowerCase())
        ? " ".concat(capitalizeWords(form.suffix)).concat(".")
        : " ".concat(capitalizeWords(form.suffix))
      : null;

    const name = {
      prefix: name_prefix,
      firstname: capitalizeWords(form.firstname),
      middlename: capitalizeWords(form.middlename),
      lastname: capitalizeWords(form.lastname),
      suffix: name_suffix,
    };

    const display_name = `${name_prefix ? name.prefix : ""}${name.firstname} ${
      name.middlename
    } ${name.lastname}${name_suffix ? name.suffix : ""}`;

    const username = `${name.firstname.match(/^\S+/)?.[0]}${name.middlename
      .charAt(0)
      .toUpperCase()}${strSanitize(name.lastname).charAt(0).toUpperCase()}`;

    const formattedForm = {
      ...form,
      username,
      display_name,
      name: JSON.stringify(name),
      designation: capitalizeAll(form.designation),
    };

    await addUserApi(formattedForm)
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
    const name_prefix = form.prefix
      ? WITH_DOT_PREFIX.includes(form.prefix.toLowerCase())
        ? capitalizeWords(form.prefix).concat(". ")
        : capitalizeWords(form.prefix).concat(" ")
      : null;

    const name_suffix = form.suffix
      ? WITH_DOT_SUFFIX.includes(form.suffix.toLowerCase())
        ? " ".concat(capitalizeWords(form.suffix)).concat(".")
        : " ".concat(capitalizeWords(form.suffix))
      : null;

    const name = {
      prefix: name_prefix,
      firstname: capitalizeWords(form.firstname),
      middlename: capitalizeWords(form.middlename),
      lastname: capitalizeWords(form.lastname),
      suffix: name_suffix,
    };

    const display_name = `${name_prefix ? name.prefix : ""}${name.firstname} ${
      name.middlename
    } ${name.lastname}${name_suffix ? name.suffix : ""}`;

    const username = `${name.firstname.match(/^\S+/)?.[0]}${name.middlename
      .charAt(0)
      .toUpperCase()}${strSanitize(name.lastname).charAt(0).toUpperCase()}`;

    const formattedForm = {
      ...form,
      username,
      display_name,
      name: JSON.stringify(name),
      designation: capitalizeAll(form.designation),
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

  const startHeartbeat = () => {
    console.log("Start Heartbeat()");
    stopHeartbeat(); // prevent duplicates
    const sendHeartbeat = async () => {
      try {
        await startHeartbeatApi();
      } catch (error) {
        console.error("Heartbeat failed", error);
      }
    };

    sendHeartbeat(); // 🔹 send immediately
    heartbeatInterval.value = window.setInterval(sendHeartbeat, 60000);
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value);
      heartbeatInterval.value = null;
    }
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
    genderOptions,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    startHeartbeat,
    stopHeartbeat,
  };
});
