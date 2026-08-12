<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, priorities } = storeToRefs(ticketStore);

const inventoryStore = useInventoryStore();
const { loading: loadingInventories } = storeToRefs(inventoryStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const itServiceStore = useItServiceStore();
const { itServiceSelect } = storeToRefs(itServiceStore);
itServiceStore.fetchItServicesSelect();

const officeStore = useOfficeStore();
const { loadingOfficeSearch: loadingOffices } = storeToRefs(officeStore);
const officeSearchQuery = ref("");

const agencyStore = useAgencyStore();
const { loading: loadingAgencies } = storeToRefs(agencyStore);
agencyStore.fetchAgencySelect();

const emit = defineEmits(["reloadTable", "success", "error", "close"]);
const props = defineProps({ pageTitle: String });

const { capitalizeAll } = useStringHandler();

const onClose = () => emit("close");
const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};
const onError = () => emit("error");

const formState = ref<ICreateTicketForm>({
  inventory: undefined,
  office: undefined,
  item_type: undefined,
  it_service: undefined,
  concern: undefined,
  priority: "low",
  contact_number: undefined,
  is_other_agency: false,
  client_name: undefined,
  full_name: undefined,
  agency: undefined,
});

const clientNameComputed = computed({
  get: () => formState.value.client_name ?? "",
  set: (v: string) => {
    formState.value.client_name = v;
  },
});

const concernComputed = computed({
  get: () => formState.value.concern ?? "",
  set: (v: string) => {
    formState.value.concern = v;
  },
});

const contactNumberComputed = computed({
  get: () => formState.value.contact_number ?? "",
  set: (v: string) => {
    formState.value.contact_number = v;
  },
});

const onClientNameBlur = () => {
  const raw = formState.value.client_name ?? "";
  formState.value.client_name = capitalizeAll(raw);
};

const onConcernBlur = () => {
  const raw = formState.value.concern ?? "";
  formState.value.concern = capitalizeAll(raw);
};

const onContactNumberBlur = () => {
  const raw = formState.value.contact_number ?? "";
  formState.value.contact_number = capitalizeAll(raw);
};

const syncFullName = () => {
  if (formState.value.is_other_agency) {
    formState.value.full_name = undefined;
    return;
  }

  const inventory = formState.value.inventory;

  formState.value.full_name =
    inventory?.inventory?.employee?.full_name ??
    inventory?.inventory?.employee?.fullname ??
    inventory?.employee?.full_name ??
    inventory?.employee?.fullname ??
    inventory?.inventory?.full_name ??
    inventory?.full_name ??
    undefined;
};

watch(
  () => formState.value.inventory,
  (inventory) => {
    syncFullName();

    if (inventory) {
      formState.value.office = undefined;
    }
  },
);

watch(
  () => formState.value.is_other_agency,
  (isOther) => {
    if (isOther) {
      formState.value.inventory = undefined;
      formState.value.office = undefined;
      formState.value.full_name = undefined;
    } else {
      formState.value.agency = undefined;
      syncFullName();
    }
  },
);

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateTicketValidationSchema>,
) => {
  await ticketStore.addTicket(event.data);
  if (hasError.value) return onError();
  onSuccess();
};

const inventorySearchQuery = ref("");
const searchInventories = async (q: string) => {
  inventorySearchQuery.value = q;
  if (!q || q.length < 2) return [];
  return await inventoryStore.fetchInventorySearch(q);
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }
  return itemTypeSelect.value.filter((itemType) =>
    itemType.type.toLowerCase().includes(q.toLowerCase()),
  );
};

const searchOffices = async (q: string) => {
  officeSearchQuery.value = q;
  if (!q || q.length < 2) return [];
  return await officeStore.fetchOfficeSearch(q);
};

const agencySearchQuery = ref("");
const searchAgencies = async (q: string) => {
  agencySearchQuery.value = q;
  if (!q || q.length < 2) return [];
  return await agencyStore.fetchAgencySearch(q);
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Create ${props.pageTitle}`">
    <UForm
      :schema="CreateTicketValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup
        name="is_other_agency"
        :error="errorBag.is_other_agency"
        :ui="{ wrapper: 'flex items-center justify-end' }"
      >
        <UCheckbox
          color="primary"
          label="Other Agency"
          v-model="formState.is_other_agency"
        />
      </UFormGroup>

      <div
        v-if="formState.is_other_agency"
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-center md:grid-cols-3"
      >
        <UFormGroup
          label="Agency"
          name="agency"
          :error="errorBag.agency"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInputMenu
            v-model="formState.agency"
            :search="searchAgencies"
            :loading="loadingAgencies"
            placeholder="Type to search..."
            option-attribute="abbreviation"
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.abbreviation }}</span>
            </template>
            <template #empty>
              <span v-if="agencySearchQuery.length < 2" class="text-gray-400">
                Type at least 2 characters...
              </span>
              <span v-else class="text-gray-400">No Agency found</span>
            </template>
          </UInputMenu>
        </UFormGroup>
      </div>

      <UFormGroup
        :label="
          formState.is_other_agency
            ? 'Client Name'
            : 'Client Name (if different from inventory owner)'
        "
        name="client_name"
        :error="errorBag.client_name"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInput
          v-model="clientNameComputed"
          @blur="onClientNameBlur"
          :placeholder="
            formState.is_other_agency
              ? ''
              : 'Leave blank if same as inventory owner'
          "
        />
      </UFormGroup>

      <UFormGroup
        label="Item Type"
        name="item_type"
        :error="errorBag.item_type"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <USelectMenu
          v-model="formState.item_type"
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

      <UFormGroup
        v-if="!formState.is_other_agency"
        label="Inventory"
        name="inventory"
        :error="errorBag.inventory"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInputMenu
          v-model="formState.inventory"
          :search="searchInventories"
          :loading="loadingInventories"
          placeholder="Search by property number / actual user..."
          option-attribute="inventory_option_attribute"
        >
          <template #option="{ option }">
            <span>{{ option.inventory_option_attribute }}</span>
          </template>
          <template #empty>
            <span v-if="inventorySearchQuery.length < 2" class="text-gray-400">
              Type at least 2 characters...
            </span>
            <span v-else class="text-gray-400">No Inventory found</span>
          </template>
        </UInputMenu>
      </UFormGroup>

      <UFormGroup
        v-if="!formState.is_other_agency && !formState.inventory"
        label="Office"
        name="office"
        :error="errorBag.office"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInputMenu
          v-model="formState.office"
          :search="searchOffices"
          :loading="loadingOffices"
          placeholder="Type to search office..."
          option-attribute="label"
        >
          <template #option="{ option }">
            <span>{{ option.label }}</span>
          </template>
          <template #empty>
            <span v-if="officeSearchQuery.length < 2" class="text-gray-400">
              Type at least 2 characters...
            </span>
            <span v-else class="text-gray-400">No Office found</span>
          </template>
        </UInputMenu>
      </UFormGroup>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between md:grid-cols-3"
      >
        <UFormGroup
          label="IT Service"
          name="it_service"
          :error="errorBag.it_service"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelect
            v-model="formState.it_service"
            :options="itServiceSelect"
            value-attribute="id"
            option-attribute="name"
            placeholder="Select"
          />
        </UFormGroup>

        <UFormGroup
          label="Priority"
          name="priority"
          :error="errorBag.priority"
          :ui="{ wrapper: 'md:w-1/2' }"
        >
          <USelect
            v-model="formState.priority"
            :options="priorities"
            value-attribute="value"
            option-attribute="label"
            placeholder="Select"
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Concern" name="concern" :error="errorBag.concern">
        <UInput v-model="concernComputed" @blur="onConcernBlur" />
      </UFormGroup>

      <UFormGroup
        label="Contact Number (Optional)"
        name="contact_number"
        :error="errorBag.contact_number"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UButtonGroup
          orient="horizontal"
          :ui="{ wrapper: { horizontal: 'w-full' } }"
        >
          <UInput
            v-model="contactNumberComputed"
            @blur="onContactNumberBlur"
            class="flex-1"
          />
        </UButtonGroup>
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
