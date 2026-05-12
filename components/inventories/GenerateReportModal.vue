<script setup lang="ts">
const inventoryStore = useInventoryStore();
const { loading } = storeToRefs(inventoryStore);

const itemTypeStore = useItemTypeStore();
const { itemTypeSelect, loading: loadingItemTypes } =
  storeToRefs(itemTypeStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

const officeStore = useOfficeStore();
const { officeSelect, loading: loadingOffices } = storeToRefs(officeStore);

const emit = defineEmits(["close", "success", "error"]);

const onClose = () => emit("close");

await Promise.all([
  itemTypeStore.fetchItemTypeSelect(),
  officeStore.fetchOfficeSelect(),
]);

const formState = reactive({
  item_type: undefined as number | undefined,
  employee: undefined as any,
  office: undefined as any,
  status: undefined as string | undefined,
});

const itemTypeComputed = computed({
  get: () => formState.item_type ?? undefined,
  set: (value) => {
    formState.item_type = value ? Number(value) : undefined;
  },
});

const employeeComputed = computed({
  get: () => formState.employee ?? undefined,
  set: (value) => {
    formState.employee = value || undefined;
  },
});

const officeComputed = computed({
  get: () => formState.office ?? undefined,
  set: (value) => {
    formState.office = value || undefined;
  },
});

const employeeOptions = ref<any[]>([]);
const employeeSearchQuery = ref("");

const searchEmployees = async (q: string) => {
  employeeSearchQuery.value = q;
  if (!q || q.length < 2) return [];

  const result = await employeeStore.fetchEmployeeSearch(q);

  const normalized = result.map((employee: any) => ({
    ...employee,
    full_name: employee.full_name ?? employee.fullname ?? "",
  }));

  employeeOptions.value = normalized;
  return normalized;
};

const officeOptions = ref<any[]>(officeSelect.value ?? []);
// const officeSearchQuery = ref("");
const officeQuery = ref("");

const searchOffices = async (q: string) => {
  officeQuery.value = q;

  if (!q || q.length < 2) {
    officeOptions.value = officeSelect.value ?? [];
    return officeOptions.value;
  }

  const result = await officeStore.fetchOfficeSearch(q);
  officeOptions.value = result ?? [];
  return officeOptions.value;
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }

  return itemTypeSelect.value.filter((itemType: any) =>
    itemType.type.toLowerCase().includes(q.toLowerCase()),
  );
};

const statusOptions = [
  { label: "Available", value: "available" },
  { label: "In Use", value: "in_use" },
  { label: "Defective", value: "defective" },
  { label: "Disposed", value: "disposed" },
];

const buildFilters = () => ({
  item_type: formState.item_type ?? null,
  employee: formState.employee?.id ?? null,
  office: formState.office?.id ?? null,
  status: formState.status ?? null,
});

const handleExportExcel = async () => {
  try {
    await inventoryStore.exportInventoryReportExcel(buildFilters());
    emit("success");
    onClose();
  } catch (error) {
    emit("error");
  }
};

const handleExportPdf = async () => {
  try {
    await inventoryStore.exportInventoryReportPdf(buildFilters());
    emit("success");
    onClose();
  } catch (error) {
    emit("error");
  }
};

watch(
  () => officeSelect.value,
  (value) => {
    if (!officeQuery.value || officeQuery.value.length < 2) {
      officeOptions.value = value ?? [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <BaseModal
    :on-close="onClose"
    title="Generate Inventory Report"
    :ui="{ width: 'md:max-w-3xl' }"
  >
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Item Type" name="item_type">
          <USelectMenu
            v-model="itemTypeComputed"
            :options="itemTypeSelect"
            :searchable="true"
            :search="searchItemTypes"
            :loading="loadingItemTypes"
            placeholder="Type to search..."
            value-attribute="id"
            option-attribute="type"
          >
            <template #option-empty="{ query }">
              <q>{{ query }}</q> not found
            </template>
            <template #empty>No Item Type found</template>
          </USelectMenu>
        </UFormGroup>

        <!-- <UFormGroup label="Status" name="status">
          <USelectMenu
            v-model="formState.status"
            :options="statusOptions"
            placeholder="Select status"
            value-attribute="value"
            option-attribute="label"
          />
        </UFormGroup> -->

        <UFormGroup label="Employee" name="employee">
          <UInputMenu
            v-model="employeeComputed"
            :search="searchEmployees"
            :options="employeeOptions"
            :loading="loadingEmployees"
            placeholder="Type to search..."
            option-attribute="full_name"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.full_name }}</span>
            </template>
            <template #empty>
              <span v-if="employeeSearchQuery.length < 2" class="text-gray-400">
                Type at least 2 characters...
              </span>
              <span v-else class="text-gray-400">No Employee found</span>
            </template>
          </UInputMenu>
        </UFormGroup>

        <UFormGroup label="Office" name="office">
          <USelectMenu
            v-model="officeComputed"
            :options="officeSelect"
            :searchable="true"
            :loading="loadingOffices"
            placeholder="Type to search office..."
            option-attribute="label"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.label }}</span>
            </template>
            <template #empty>No Office found</template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <div class="flex gap-3 justify-end">
        <UButton
          color="gray"
          variant="outline"
          @click="handleExportPdf"
          :loading="loading"
        >
          Export PDF
        </UButton>

        <UButton color="primary" @click="handleExportExcel" :loading="loading">
          Export Excel
        </UButton>
      </div>
    </div>
  </BaseModal>
</template>
