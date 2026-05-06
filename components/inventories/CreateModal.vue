<script setup lang="ts">
import { format } from "date-fns";
const inventoryStore = useInventoryStore();
const {
  loading: loadingInventories,
  errorBag,
  hasError,
} = storeToRefs(inventoryStore);

const brandModelStore = useBrandModelStore();
const { loading: loadingBrandModels } = storeToRefs(brandModelStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const { capitalizeAll } = useStringHandler();

const props = defineProps({
  pageTitle: String,
});

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = reactive<ICreateInventoryForm>({
  employee: undefined,
  item_type: undefined,
  brand_model: undefined,

  ip_address: undefined,
  mac_address: undefined,
  remarks: undefined,

  operating_system_name: undefined,
  os_license_number: undefined,
  anti_virus_name: undefined,
  anti_virus_license_number: undefined,
  microsoft_office_name: undefined,
  ms_office_license_number: undefined,
  other_installed_applications: undefined,

  property_number: undefined,
  date_acquired: undefined,
  warranty_expiration_date: undefined,
  serial_number: undefined,
  status: undefined,

  // for inventory_internal_components table
  internal_components: [],
  inventory: undefined,
});

const serialNumberValue = computed({
  get: () => formState.serial_number ?? undefined,
  set: (val) => {
    formState.serial_number = val;
  },
});

const ipAddressValue = computed({
  get: () => formState.ip_address ?? undefined,
  set: (val) => {
    formState.ip_address = val;
  },
});

const macAddressValue = computed({
  get: () => formState.mac_address ?? undefined,
  set: (val) => {
    formState.mac_address = val;
  },
});

const itemTypeComputed = computed({
  get: () => formState.item_type ?? undefined,
  set: (value) => {
    formState.item_type = value ? Number(value) : undefined;
  },
});

const operatingSystemNameComputed = computed({
  get: () => formState.operating_system_name ?? undefined,
  set: (value) => {
    formState.operating_system_name = value;
  },
});

const osLicenseNumberComputed = computed({
  get: () => formState.os_license_number ?? undefined,
  set: (value) => {
    formState.os_license_number = value;
  },
});

const antiVirusNameComputed = computed({
  get: () => formState.anti_virus_name ?? undefined,
  set: (value) => {
    formState.anti_virus_name = value;
  },
});

const antiVirusLicenseNumberComputed = computed({
  get: () => formState.anti_virus_license_number ?? undefined,
  set: (value) => {
    formState.anti_virus_license_number = value;
  },
});

const microsoftOfficeNameComputed = computed({
  get: () => formState.microsoft_office_name ?? undefined,
  set: (value) => {
    formState.microsoft_office_name = value;
  },
});

const msOfficeLicenseNumberComputed = computed({
  get: () => formState.ms_office_license_number ?? undefined,
  set: (value) => {
    formState.ms_office_license_number = value;
  },
});

const otherInstalledApplicationsComputed = computed({
  get: () => formState.other_installed_applications ?? undefined,
  set: (value) => {
    formState.other_installed_applications = value;
  },
});

const remarksComputed = computed({
  get: () => formState.remarks ?? undefined,
  set: (value) => {
    formState.remarks = value;
  },
});

const employeeComputed = computed({
  get: () => formState.employee ?? undefined,
  set: (value) => {
    formState.employee = value ? value : undefined;
  },
});

const brandModelComputed = computed({
  get: () => formState.brand_model ?? undefined,
  set: (value) => {
    formState.brand_model = value ? value : undefined;
  },
});

const inventoryComputed = computed({
  get: () => formState.inventory ?? undefined,
  set: (value) => {
    formState.inventory = value ? value : undefined;
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateInventoryValidationSchema>,
) => {
  console.log(event.data);
  await inventoryStore.addInventory(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const brandModelOptions = ref<TBrandModelSelectOption[]>([]);
const searchQuery = ref("");

const searchBrandModels = async (q: string) => {
  searchQuery.value = q;
  if (!searchQuery.value || searchQuery.value.length < 2) return [];
  if (itemTypeComputed.value === 1) {
    const result = await brandModelStore.fetchBrandModelSelect(
      searchQuery.value,
    );
    brandModelOptions.value = result;
    return result;
  }
  const result = await brandModelStore.fetchBrandModelSearch(
    searchQuery.value,
    itemTypeComputed.value,
  );
  brandModelOptions.value = result;
  console.log(result);
  return result;
};

const employeeOptions = ref<TEmployeeSelectOption[]>([]);
const employeeSearchQuery = ref("");

const searchEmployees = async (q: string) => {
  employeeSearchQuery.value = q;
  if (!employeeSearchQuery.value || employeeSearchQuery.value.length < 2)
    return [];
  const result = await employeeStore.fetchEmployeeSearch(
    employeeSearchQuery.value,
  );
  employeeOptions.value = result;
  return result;
};

const inventoryMainAssetSearchOptions = ref<TInventorySelectOption[]>([]);
const inventoryMainAssetSearchQuery = ref("");

const searchInventoryMainAsset = async (q: string) => {
  inventoryMainAssetSearchQuery.value = q;
  if (
    !inventoryMainAssetSearchQuery.value ||
    inventoryMainAssetSearchQuery.value.length < 2
  )
    return [];
  const result = await inventoryStore.fetchInventoryMainAssetSearch(
    inventoryMainAssetSearchQuery.value,
  );
  inventoryMainAssetSearchOptions.value = result;
  return result;
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }
  const filtered = itemTypeSelect.value.filter((itemType) =>
    itemType.type.toLowerCase().includes(q.toLowerCase()),
  );
  return filtered;
};

watch(itemTypeComputed, (val) => {
  if (val === 1 && formState.internal_components.length === 0) {
    formState.internal_components.push({
      brand_model: undefined,
      quantity: 1,
    });
  }
  if (val !== 1) formState.internal_components = [];
});

const addRow = () => {
  if (!formState.internal_components) {
    formState.internal_components = [];
  }
  formState.internal_components.push({
    brand_model: undefined,
    specific_serial_number: undefined,
    quantity: 1,
  });
};

const removeRow = (index: number) => {
  if (
    formState.internal_components &&
    formState.internal_components.length > 1
  ) {
    formState.internal_components.splice(index, 1);
  } else if (
    formState.internal_components &&
    formState.internal_components.length === 1
  ) {
    formState.internal_components = [];
  }
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Create ${props.pageTitle}`"
    :ui="{ width: 'md:max-w-7xl' }"
  >
    <!-- REMOVED: :error="errorBag...." props from UFormGroup, UForm will handle errors automatically -->
    <UForm
      :schema="CreateInventoryValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Item Type"
          name="item_type"
          :ui="{ wrapper: 'md:w-full' }"
        >
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
            <template #empty> No Item Type found </template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <div
        v-if="
          itemTypeComputed === 1 ||
          itemTypeComputed === 164 ||
          itemTypeComputed === 12 ||
          itemTypeComputed === 17 ||
          itemTypeComputed === 171
        "
        class="space-y-6"
      >
        <UDivider label="Basic Information" />
        <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
          <UFormGroup
            label="Employee (Actual End-User)"
            name="employee"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInputMenu
              v-model="employeeComputed"
              :search="searchEmployees"
              :loading="loadingEmployees"
              placeholder="Type to search..."
              option-attribute="full_name"
            >
              <template #option="{ option }">
                <span class="truncate">{{ option.full_name }}</span>
              </template>
              <template #empty>
                <span
                  v-if="employeeSearchQuery.length < 2"
                  class="text-gray-400"
                  >Type at least 2 characters...</span
                >
                <span v-else class="text-gray-400">No Employee found</span>
              </template>
            </UInputMenu>
          </UFormGroup>
        </div>

        <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
          <UFormGroup
            label="IP Address"
            name="ip_address"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInput v-model="ipAddressValue" />
          </UFormGroup>

          <UFormGroup
            label="MAC Address"
            name="mac_address"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <UInput v-model="macAddressValue" />
          </UFormGroup>
        </div>
        <UFormGroup label="Remarks" name="remarks">
          <UTextarea v-model="remarksComputed" autoresize />
        </UFormGroup>
      </div>

      <div
        :class="
          itemTypeComputed === 1 || itemTypeComputed === 164
            ? 'grid grid-cols-2 gap-4'
            : 'grid grid-cols-1 gap-4'
        "
      >
        <!-- ? Hardware -->
        <div class="col-span-1 gap-4 flex flex-col">
          <UDivider label="Hardware" />
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Property Number"
              name="property_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="formState.property_number" />
            </UFormGroup>
            <UFormGroup
              label="Date Acquired"
              name="date_acquired"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="
                    formState.date_acquired
                      ? format(formState.date_acquired, 'yyyy/MM/dd')
                      : 'Select Date'
                  "
                  :ui="{ base: 'w-full md:w-full' }"
                  variant="outline"
                />
                <template #panel="{ close }">
                  <BaseDatePicker
                    v-model="formState.date_acquired"
                    is-required
                    @close="close"
                  />
                </template>
              </UPopover>
            </UFormGroup>
          </div>
          <!-- Internal Components -->
          <!-- CHANGED: Added v-if check and removed manual error prop. UForm will now handle the errors for dynamic fields. -->
          <UFormGroup
            v-if="
              itemTypeComputed === 1 || // System Unit
              itemTypeComputed === 164
            "
            label="Internal Components"
            name="internal_components"
            class="flex flex-col"
            :required="
              itemTypeComputed === 1 || // System Unit
              itemTypeComputed === 164 // Laptop
            "
          >
            <div
              class="flex space-y-6 md:space-y-4 md:flex md:space-x-4 items-end"
              v-for="(row, index) in formState.internal_components"
              :key="index"
            >
              <UFormGroup
                label="Model"
                :name="`internal_components.${index}.brand_model`"
                :ui="{ wrapper: 'md:w-full' }"
                :required="
                  itemTypeComputed === 1 || // System Unit
                  itemTypeComputed === 164 // Laptop
                "
                :key="index"
              >
                <UInputMenu
                  v-model="row.brand_model"
                  :search="searchBrandModels"
                  :loading="loadingBrandModels"
                  placeholder="Type to search..."
                  option-attribute="option_attribute_description"
                  :key="index"
                >
                  <template #option="{ option }">
                    <span class="truncate">{{
                      option.option_attribute_description
                    }}</span>
                  </template>

                  <template #empty>
                    <span v-if="searchQuery.length < 2" class="text-gray-400"
                      >Type at least 2 characters...</span
                    >
                    <span v-else class="text-gray-400"
                      >No Brand Model found</span
                    >
                  </template>
                </UInputMenu>
              </UFormGroup>
              <UFormGroup
                label="Qty"
                :name="`internal_components.${index}.quantity`"
                :ui="{ wrapper: 'md:w-16' }"
                :required="
                  itemTypeComputed === 1 || // System Unit
                  itemTypeComputed === 164
                "
              >
                <UInput type="number" v-model="row.quantity" />
              </UFormGroup>
              <div class="flex items-end">
                <UButton
                  @click="removeRow(index)"
                  square
                  variant="outline"
                  icon="i-heroicons-x-mark"
                  color="red"
                  :disabled="index === 0"
                />
              </div>
            </div>
          </UFormGroup>
          <div
            v-if="itemTypeComputed === 1 || itemTypeComputed === 164"
            class="text-center"
          >
            <UButton
              color="orange"
              size="sm"
              icon="material-symbols:add-row-below-outline-rounded"
              @click="addRow"
            />
          </div>
        </div>
        <!-- ? Software -->
        <div
          v-if="itemTypeComputed === 1 || itemTypeComputed === 164"
          class="col-span-1 gap-4 flex flex-col"
        >
          <UDivider label="Software" />
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Operating System"
              name="operating_system_name"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="operatingSystemNameComputed" />
            </UFormGroup>
            <UFormGroup
              label="OS Licence"
              name="os_license_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="osLicenseNumberComputed" />
            </UFormGroup>
          </div>
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Antivirus"
              name="anti_virus_name"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="antiVirusNameComputed" />
            </UFormGroup>
            <UFormGroup
              label="Antivirus Licence"
              name="anti_virus_license_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="antiVirusLicenseNumberComputed" />
            </UFormGroup>
          </div>
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Microsoft Office"
              name="microsoft_office_name"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="microsoftOfficeNameComputed" />
            </UFormGroup>
            <UFormGroup
              label="MS Office Licence"
              name="ms_office_license_number"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UInput v-model="msOfficeLicenseNumberComputed" />
            </UFormGroup>
          </div>
          <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
            <UFormGroup
              label="Other Installed Applications"
              name="other_installed_applications"
              :ui="{ wrapper: 'md:w-full' }"
            >
              <UTextarea
                v-model="otherInstalledApplicationsComputed"
                autoresize
              />
            </UFormGroup>
          </div>
        </div>
      </div>

      <div
        class="space-y-6 md:space-y-0 md:flex md:space-x-6"
        v-if="itemTypeComputed !== 1 && itemTypeComputed !== 164"
      >
        <UFormGroup
          label="Parent Component"
          name="inventory"
          :ui="{ wrapper: 'md:w-full' }"
          v-if="
            itemTypeComputed !== 12 &&
            itemTypeComputed !== 17 &&
            itemTypeComputed !== 171
          "
        >
          <UInputMenu
            v-model="inventoryComputed"
            :search="searchInventoryMainAsset"
            :loading="loadingInventories"
            placeholder="Search by property number..."
            option-attribute="property_number"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.property_number }}</span>
            </template>

            <template #empty>
              <span v-if="searchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400"
                >No Parent Component found</span
              >
            </template>
          </UInputMenu>
        </UFormGroup>

        <UFormGroup
          label="Brand Model"
          name="brand_model"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInputMenu
            v-model="brandModelComputed"
            :search="searchBrandModels"
            :loading="loadingBrandModels"
            placeholder="Type to search..."
            option-attribute="option_attribute_description"
          >
            <template #option="{ option }">
              <span class="truncate">{{
                option.option_attribute_description
              }}</span>
            </template>

            <template #empty>
              <span v-if="searchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400">No Brand Model found</span>
            </template>
          </UInputMenu>
        </UFormGroup>

        <UFormGroup
          label="Serial Number"
          name="serial_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="serialNumberValue" />
        </UFormGroup>
      </div>

      <UButton type="submit" :loading="loadingInventories"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
