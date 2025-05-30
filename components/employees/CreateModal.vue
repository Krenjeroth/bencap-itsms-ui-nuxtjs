<script setup lang="ts">
const employeeStore = useEmployeeStore();
const { loading, errorBag, hasError } = storeToRefs(employeeStore);

const departmentStore = useDepartmentStore();
const { loading: loadingDepartments, departmentSelect } =
  storeToRefs(departmentStore);
departmentStore.fetchDepartmentSelect();

const positionStore = usePositionStore();
const { loading: loadingPositions, positionSelect } =
  storeToRefs(positionStore);
positionStore.fetchPositionSelect();

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const { capitalizeAll } = useStringHandler();

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreateEmployeeForm>({
  uid: undefined,
  firstname: undefined,
  middlename: undefined,
  lastname: undefined,
  suffix: undefined,
  position: undefined,
  department: undefined,
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateEmployeeValidationSchema>
) => {
  console.log(event.data);
  // await employeeStore.addEmployee(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const searchPositions = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (positionSelect.value.length === 0) {
    await positionStore.fetchPositionSelect();
  }
  return positionSelect.value.filter((pos) =>
    pos.name.toLowerCase().includes(q.toLowerCase())
  );
};

const searchDepartments = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (departmentSelect.value.length === 0) {
    await departmentStore.fetchDepartmentSelect();
  }
  return departmentSelect.value.filter((dept) =>
    dept.abbreviation.toLowerCase().includes(q.toLowerCase())
  );
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="'Create Employee'"
    :ui="{ width: 'md:max-w-3xl' }"
  >
    <UForm
      :schema="CreateEmployeeValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="UID" name="uid" :error="errorBag.uid">
        <UInput v-model="formState.uid" />
      </UFormGroup>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between md:grid-cols-3"
      >
        <UFormGroup
          label="First Name"
          name="firstname"
          :error="errorBag.firstname"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.firstname" />
        </UFormGroup>

        <UFormGroup
          label="Middle Initial"
          name="middlename"
          :error="errorBag.middlename"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.middlename" />
        </UFormGroup>

        <UFormGroup
          label="Last Name"
          name="lastname"
          :error="errorBag.lastname"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.lastname" />
        </UFormGroup>

        <UFormGroup
          label="Suffix"
          name="suffix"
          :error="errorBag.suffix"
          :ui="{ wrapper: 'md:w-full md:max-w-20' }"
        >
          <UInput v-model="formState.suffix" />
        </UFormGroup>
      </div>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between md:grid-cols-3"
      >
        <UFormGroup
          label="Position"
          name="position"
          :error="errorBag.position"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelectMenu
            v-model="formState.position"
            :options="positionSelect"
            :searchable="true"
            :search="searchPositions"
            :loading="loadingPositions"
            placeholder="Type to search..."
            value-attribute="id"
            option-attribute="name"
          >
            <template #option-empty="{ query }">
              <q>{{ query }}</q> not found
            </template>

            <template #empty> No Position found </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          label="Department"
          name="department"
          :error="errorBag.department"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelectMenu
            v-model="formState.department"
            :options="departmentSelect"
            :searchable="true"
            :search="searchDepartments"
            :loading="loadingDepartments"
            placeholder="Type to search..."
            value-attribute="id"
            option-attribute="abbreviation"
          >
            <template #option-empty="{ query }">
              <q>{{ query }}</q> not found
            </template>

            <template #empty> No Department found </template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
