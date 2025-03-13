export const useUserStore = defineStore("userStore", () => {
  const { fetchUsersApi } = useUserApi();
  const users = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  // const sort = ref<{ column: string; direction: SortDirection }>({
  //   column: "created_at",
  //   direction: SortDirection.DESC,
  // });
  const totalUsers = ref(0);
  const selectedStatus = ref("");

  const fetchUsers = async () => {
    loading.value = true;
    try {
      const queryParams = new URLSearchParams({
        page: page.value.toString(),
        per_page: pageCount.value.toString(),
        // sort: sort.value.column,
        // order: sort.value.direction,
        search: search.value,
        ...(selectedStatus.value ? { status: selectedStatus.value } : {}),
      });

      const response = await fetchUsersApi(queryParams);

      // users.value = response.data.map((user: any) => ({
      //   ...user,
      //   created_at: transformUtcDatetime(
      //     user.created_at,
      //     "MMMM DD, YYYY hh:mm A"
      //   ),
      // }));

      // totalUsers.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { fetchUsers };
});
