export const useEmployeeStore = defineStore("employeeStore", () => {
  const { fetchEmployeesApi, addEmployeeApi } = useEmployeeApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll } = useStringHandler();
  // const { transformUtcDatetime } = useDateHandler();
  enum SortDirection {
    ASC = "asc",
    DESC = "desc",
  }
  const employees = ref([]);
  const loading = ref(false);
  const page = ref(1);
  const pageCount = ref(5);
  const search = ref("");
  const sort = ref<{ column: string; direction: SortDirection }>({
    column: "created_at",
    direction: SortDirection.DESC,
  });
  const totalEmployees = ref(0);
  const selectedStatus = ref("");

  const fetchEmployees = async () => {
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

      const response = await fetchEmployeesApi(queryParams);

      employees.value = response.data.map((employee: any) => ({
        ...employee,
        department_id: employee.department.id,
        department_full: `${employee.department.full_name} (${employee.department.abbreviation})`,
        position_id: employee.position.id,
        position_name: employee.position.name,
      }));

      totalEmployees.value = Number(response.meta.total) || 0;
    } catch (err: any) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addEmployee = async (form: ICreateEmployeeForm) => {
    loading.value = true;
    resetErrorBag();

    const formattedForm = {
      ...form,
      firstname: capitalizeAll(form.firstname),
      middlename: capitalizeAll(form.middlename) + ".",
      lastname: capitalizeAll(form.lastname),
      suffix: capitalizeAll(form.suffix) + ".",
    };

    await addEmployeeApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // const updatePosition = async (id: string, form: IUpdatePositionForm) => {
  //   loading.value = true;
  //   resetErrorBag();
  //   const formattedForm = {
  //     ...form,
  //     name: capitalizeAll(form.name),
  //     abbreviation: capitalizeAll(form.abbreviation),
  //   };
  //   await updatePositionApi(id, formattedForm)
  //     .catch((err: any) => {
  //       transformValidationErrors(err);
  //     })
  //     .finally(() => {
  //       loading.value = false;
  //     });
  // };

  // const deletePosition = async (id: string) => {
  //   loading.value = true;
  //   resetErrorBag();
  //   await deletePositionApi(id)
  //     .catch((err: any) => {
  //       transformValidationErrors(err);
  //     })
  //     .finally(() => {
  //       loading.value = false;
  //     });
  // };

  return {
    employees,
    loading,
    errorBag,
    hasError,
    page,
    pageCount,
    search,
    sort,
    totalEmployees,
    selectedStatus,
    fetchEmployees,
    addEmployee,
    // updatePosition,
    // deletePosition,
  };
});
