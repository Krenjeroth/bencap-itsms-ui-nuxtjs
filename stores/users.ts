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

  const HEARTBEAT_INTERVAL = 30_000;
  const MAX_RETRIES = 3;
  const BASE_RETRY_DELAY = 5_000;

  const heartbeatInterval = ref<number | null>(null);
  const heartbeatRunning = ref(false);
  const heartbeatRetryTimeout = ref<number | null>(null);

  // Cancels a heartbeat HTTP request that is still in progress during logout.
  const heartbeatAbortController = ref<AbortController | null>(null);

  // Invalidates callbacks, retries, and interval ticks created by an older session.
  const heartbeatGeneration = ref(0);

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

      const response: any = await fetchUsersApi(queryParams);

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
    if (heartbeatRunning.value) {
      return;
    }

    console.log("Start Heartbeat()");

    heartbeatRunning.value = true;

    const generation = ++heartbeatGeneration.value;

    const sendHeartbeat = async () => {
      let retryCount = 0;

      while (
        heartbeatRunning.value &&
        generation === heartbeatGeneration.value &&
        retryCount <= MAX_RETRIES
      ) {
        const controller = new AbortController();

        try {
          heartbeatAbortController.value = controller;

          await startHeartbeatApi(controller.signal);

          if (heartbeatAbortController.value === controller) {
            heartbeatAbortController.value = null;
          }

          return;
        } catch (error: any) {
          // Clear this request's controller after a failed or aborted request.
          if (heartbeatAbortController.value === controller) {
            heartbeatAbortController.value = null;
          }

          // Expected when stopHeartbeat() aborts an in-flight request during logout.
          if (error?.name === "AbortError") {
            return;
          }

          // Never retry after logout or after an older heartbeat generation is invalid.
          if (
            !heartbeatRunning.value ||
            generation !== heartbeatGeneration.value
          ) {
            return;
          }

          retryCount++;

          if (retryCount > MAX_RETRIES) {
            console.error("Heartbeat failed after maximum retries", error);
            return;
          }

          const delay = BASE_RETRY_DELAY * Math.pow(2, retryCount - 1);

          await new Promise<void>((resolve) => {
            heartbeatRetryTimeout.value = window.setTimeout(() => {
              heartbeatRetryTimeout.value = null;
              resolve();
            }, delay);
          });
        }
      }
    };

    void sendHeartbeat();

    heartbeatInterval.value = window.setInterval(() => {
      void sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
  };

  const stopHeartbeat = () => {
    // Invalidate all existing heartbeat callbacks.
    heartbeatGeneration.value++;
    heartbeatRunning.value = false;

    if (heartbeatInterval.value !== null) {
      window.clearInterval(heartbeatInterval.value);
      heartbeatInterval.value = null;
    }

    if (heartbeatRetryTimeout.value !== null) {
      window.clearTimeout(heartbeatRetryTimeout.value);
      heartbeatRetryTimeout.value = null;
    }

    heartbeatAbortController.value?.abort();
    heartbeatAbortController.value = null;
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
