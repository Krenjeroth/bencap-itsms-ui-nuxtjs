<script setup lang="ts">
import { format } from "date-fns";
const inventoryStore = useInventoryStore();
const { loading, errorBag, hasError } = storeToRefs(inventoryStore);

const brandModelStore = useBrandModelStore();
const { loading: loadingBrandModels } = storeToRefs(brandModelStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

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

const formState = ref<ICreateInventoryForm>({
  brand_model: undefined,
  employee: undefined,
  parent_component: undefined,
  code: undefined,
  barcode: undefined,
  description: undefined,
  serial_number: undefined,
  property_number: undefined,
  date_issued: undefined,
  date_acquired: undefined,
  date_accepted: undefined,
  date_installed: undefined,
  ip_address: undefined,
  mac_address: undefined,
});

const parentComponentValue = computed({
  get: () => formState.value.parent_component ?? undefined,
  set: (val) => {
    formState.value.parent_component = capitalizeAll(val);
  },
});

const descriptionValue = computed({
  get: () => formState.value.description ?? undefined,
  set: (val) => {
    formState.value.description = capitalizeAll(val);
  },
});

const serialNumberValue = computed({
  get: () => formState.value.serial_number ?? undefined,
  set: (val) => {
    formState.value.serial_number = capitalizeAll(val);
  },
});

const ipAddressValue = computed({
  get: () => formState.value.ip_address ?? undefined,
  set: (val) => {
    formState.value.ip_address = capitalizeAll(val);
  },
});

const macAddressValue = computed({
  get: () => formState.value.mac_address ?? undefined,
  set: (val) => {
    formState.value.mac_address = capitalizeAll(val);
  },
});

const inventoryTypeValue = computed({
  get: () => formState.value.inventory_type ?? undefined,
  set: (val) => {
    formState.value.inventory_type = capitalizeAll(val);
  },
});

// const typeComputed = computed({
//   get: () => formState.value.type,
//   set: (value) => {
//     formState.value.type = capitalizeAll(value);
//   },
// });

// const classificationComputed = computed({
//   get: () => formState.value.classification,
//   set: (value) => {
//     formState.value.classification = capitalizeAll(value);
//   },
// });

// const purposeComputed = computed({
//   get: () => formState.value.purpose,
//   set: (value) => {
//     formState.value.purpose = capitalizeAll(value);
//   },
// });

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateInventoryValidationSchema>
) => {
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
  const result = await brandModelStore.fetchBrandModelSelect(searchQuery.value);
  brandModelOptions.value = result;
  return result;
};

const employeeOptions = ref<TEmployeeSelectOption[]>([]);
const employeeSearchQuery = ref("");

const searchEmployees = async (q: string) => {
  employeeSearchQuery.value = q;
  if (!employeeSearchQuery.value || employeeSearchQuery.value.length < 2)
    return [];
  const result = await employeeStore.fetchEmployeeSearch(
    employeeSearchQuery.value
  );
  employeeOptions.value = result;
  return result;
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`Create ${props.pageTitle}`"
    :ui="{ width: 'md:max-w-4xl' }"
  >
    <UForm
      :schema="CreateInventoryValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Property Number"
          name="property_number"
          :error="errorBag.property_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.property_number" />
        </UFormGroup>

        <UFormGroup
          label="Parent Component"
          name="parent_component"
          :error="errorBag.parent_component"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="parentComponentValue" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Brand Model"
        name="brand_model"
        :error="errorBag.brand_model"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInputMenu
          v-model="formState.brand_model"
          :search="searchBrandModels"
          :loading="loadingBrandModels"
          placeholder="Type to search..."
          option-attribute="name"
        >
          <template #option="{ option }">
            <span class="truncate">{{ option.name }}</span>
          </template>

          <template #empty>
            <span v-if="searchQuery.length < 2" class="text-gray-400"
              >Type at least 2 characters...</span
            >
            <span v-else class="text-gray-400">No Brand Model found</span>
          </template>
        </UInputMenu>
      </UFormGroup>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Employee (Actual End-User)"
          name="employee"
          :error="errorBag.employee"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInputMenu
            v-model="formState.employee"
            :search="searchEmployees"
            :loading="loadingEmployees"
            placeholder="Type to search..."
            option-attribute="full_name"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.full_name }}</span>
            </template>

            <template #empty>
              <span v-if="employeeSearchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400">No Employee found</span>
            </template>
          </UInputMenu>
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Serial Number"
          name="serial_number"
          :error="errorBag.serial_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="serialNumberValue" />
        </UFormGroup>

        <UFormGroup
          label="Inventory Type"
          name="inventory_type"
          :error="errorBag.inventory_type"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="inventoryTypeValue" />
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Date Issued"
          name="date_issued"
          :error="errorBag.date_issued"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="
                formState.date_issued
                  ? format(formState.date_issued, 'yyyy/MM/dd')
                  : 'Select Date'
              "
              :ui="{ base: 'w-full md:w-full' }"
              variant="outline"
            />

            <template #panel="{ close }">
              <BaseDatePicker
                v-model="formState.date_issued"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
        </UFormGroup>

        <UFormGroup
          label="Date Acquired"
          name="date_acquired"
          :error="errorBag.date_acquired"
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

        <UFormGroup
          label="Date Accepted"
          name="date_accepted"
          :error="errorBag.date_accepted"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="
                formState.date_accepted
                  ? format(formState.date_accepted, 'yyyy/MM/dd')
                  : 'Select Date'
              "
              :ui="{ base: 'w-full md:w-full' }"
              variant="outline"
            />

            <template #panel="{ close }">
              <BaseDatePicker
                v-model="formState.date_accepted"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
        </UFormGroup>

        <UFormGroup
          label="Date Installed"
          name="date_installed"
          :error="errorBag.date_installed"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="
                formState.date_installed
                  ? format(formState.date_installed, 'yyyy/MM/dd')
                  : 'Select Date'
              "
              :ui="{ base: 'w-full md:w-full' }"
              variant="outline"
            />

            <template #panel="{ close }">
              <BaseDatePicker
                v-model="formState.date_installed"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="IP Address"
          name="ip_address"
          :error="errorBag.ip_address"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="ipAddressValue" />
        </UFormGroup>

        <UFormGroup
          label="MAC Address"
          name="mac_address"
          :error="errorBag.mac_address"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="macAddressValue" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Description"
        name="description"
        :error="errorBag.description"
      >
        <!-- <UInput v-model="descriptionValue" /> -->
        <UTextarea v-model="descriptionValue" autoresize />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
