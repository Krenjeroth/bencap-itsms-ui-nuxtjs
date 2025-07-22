<script setup lang="ts">
import { format } from "date-fns";
const itemStore = useItemStore();
const { loading, errorBag, hasError } = storeToRefs(itemStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

const inventoryItemStore = useInventoryItemStore();
const { loading: loadingInventoryItems } = storeToRefs(inventoryItemStore);

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

const formState = ref<ICreateItemForm>({
  // brand_model: undefined,
  employee: undefined,
  inventory_item: undefined,
  parent_component: undefined,
  code: undefined,
  barcode: undefined,
  description: undefined,
  serial_number: undefined,
  property_number: undefined,
  ics_number: undefined,
  iar_number: undefined,
  po_number: undefined,
  control_number: undefined,
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

const icsNumberValue = computed({
  get: () => formState.value.ics_number ?? undefined,
  set: (val) => {
    formState.value.ics_number = capitalizeAll(val);
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

const iarNumberValue = computed({
  get: () => formState.value.iar_number ?? undefined,
  set: (val) => {
    formState.value.iar_number = capitalizeAll(val);
  },
});

const poNumberValue = computed({
  get: () => formState.value.po_number ?? undefined,
  set: (val) => {
    formState.value.po_number = capitalizeAll(val);
  },
});

const controlNumberValue = computed({
  get: () => formState.value.control_number ?? undefined,
  set: (val) => {
    formState.value.control_number = capitalizeAll(val);
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
  event: IFormSubmitEvent<TCreateItemValidationSchema>
) => {
  await itemStore.addItem(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const inventoryItemOptions = ref<TInventoryItemSelectOption[]>([]);
const inventoryItemSearchQuery = ref("");

const searchInventoryItems = async (q: string) => {
  inventoryItemSearchQuery.value = q;
  if (
    !inventoryItemSearchQuery.value ||
    inventoryItemSearchQuery.value.length < 2
  )
    return [];
  const result = await inventoryItemStore.fetchInventoryItemSearch(
    inventoryItemSearchQuery.value
  );
  inventoryItemOptions.value = result;
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
      :schema="CreateItemValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup
        label="Inventory Item"
        name="inventory_item"
        :error="errorBag.inventory_item"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInputMenu
          v-model="formState.inventory_item"
          :search="searchInventoryItems"
          :loading="loadingInventoryItems"
          placeholder="Type to search..."
          option-attribute="description"
        >
          <template #option="{ option }">
            <span class="truncate">{{ option.description }}</span>
          </template>

          <template #empty>
            <span
              v-if="inventoryItemSearchQuery.length < 2"
              class="text-gray-400"
              >Type at least 2 characters...</span
            >
            <span v-else class="text-gray-400">No Inventory Item found</span>
          </template>
        </UInputMenu>
      </UFormGroup>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Employee (Issue To)"
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
          label="Parent Component"
          name="parent_component"
          :error="errorBag.parent_component"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="parentComponentValue" />
        </UFormGroup>

        <UFormGroup
          label="Property Number"
          name="property_number"
          :error="errorBag.property_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.property_number" />
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="ICS Number"
          name="ics_number"
          :error="errorBag.ics_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="icsNumberValue" />
        </UFormGroup>

        <UFormGroup
          label="IAR Number"
          name="iar_number"
          :error="errorBag.iar_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="iarNumberValue" />
        </UFormGroup>

        <UFormGroup
          label="PO Number (Purchase Order)"
          name="po_number"
          :error="errorBag.po_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="poNumberValue" />
        </UFormGroup>

        <UFormGroup
          label="Control Number"
          name="control_number"
          :error="errorBag.control_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="controlNumberValue" />
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
