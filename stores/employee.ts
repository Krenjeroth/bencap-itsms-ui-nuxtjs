export const useEmployeeStore = defineStore("employeeStore", () => {
  const {
    fetchEmployeesApi,
    addEmployeeApi,
    updateEmployeeApi,
    deleteEmployeeApi,
    fetchEmployeeSearchApi,
  } = useEmployeeApi();
  const { hasError, errorBag, transformValidationErrors, resetErrorBag } =
    useErrorHandler();
  const { capitalizeAll, strDeepSanitize } = useStringHandler();
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
        middlename: strDeepSanitize(employee.middlename),
        suffix: strDeepSanitize(employee.suffix),
        department_id: employee.department.id,
        department_full: `${employee.department.full_name} (${employee.department.abbreviation})`,
        position_id: employee.position.id,
        position_name: `${employee.position.name} (${employee.position.abbreviation})`,
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

    const firstname = capitalizeAll(form.firstname);
    const suffix = form.suffix ? capitalizeAll(form.suffix).concat(".") : "";
    const middlename = form.middlename
      ? capitalizeAll(form.middlename).concat(".")
      : "";
    const lastname = capitalizeAll(form.lastname);

    const formattedForm = {
      ...form,
      department_id: form.department,
      position_id: form.position,
      firstname,
      middlename,
      lastname,
      suffix,
      full_name: `${firstname} ${middlename} ${lastname}${
        suffix ? " " + suffix : ""
      }`,
    };

    await addEmployeeApi(formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const updateEmployee = async (id: string, form: IUpdateEmployeeForm) => {
    loading.value = true;
    resetErrorBag();

    const firstname = capitalizeAll(form.firstname);
    const suffix = form.suffix ? capitalizeAll(form.suffix).concat(".") : "";
    const middlename = form.middlename
      ? capitalizeAll(form.middlename).concat(".")
      : "";
    const lastname = capitalizeAll(form.lastname);

    const formattedForm = {
      ...form,
      department_id: form.department ? Number(form.department) : undefined,
      position_id: form.position ? Number(form.position) : undefined,
      firstname,
      middlename,
      lastname,
      suffix,
      full_name: `${firstname} ${middlename} ${lastname}${
        suffix ? " " + suffix : ""
      }`,
    };

    await updateEmployeeApi(id, formattedForm)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const deleteEmployee = async (id: string) => {
    loading.value = true;
    resetErrorBag();
    await deleteEmployeeApi(id)
      .catch((err: any) => {
        transformValidationErrors(err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const fetchEmployeeSearch = async (q: string) => {
    try {
      const queryParams = new URLSearchParams({
        q,
        limit: "50",
      });
      const response = await fetchEmployeeSearchApi(queryParams);
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      return [];
    }
  };

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
    updateEmployee,
    deleteEmployee,
    fetchEmployeeSearch,
  };
});
