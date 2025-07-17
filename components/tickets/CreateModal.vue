<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, priorities } = storeToRefs(ticketStore);

const itemStore = useItemStore();
const { loading: loadingItems } = storeToRefs(itemStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const itServiceStore = useItServiceStore();
const { itServiceSelect } = storeToRefs(itServiceStore);
itServiceStore.fetchItServicesSelect();

const agencyStore = useAgencyStore();
const { loading: loadingAgencies } = storeToRefs(agencyStore);
agencyStore.fetchAgencySelect();

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const props = defineProps({
  pageTitle: String,
});

const { capitalizeAll, capitalizeSentences } = useStringHandler();

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreateTicketForm>({
  item: undefined,
  item_type: undefined,
  it_service: undefined,
  concern: undefined,
  priority: "low",
  contact_number: undefined,
  is_other_agency: false,
  full_name: undefined,
  agency: undefined,
});

const concernComputed = computed({
  get: () => formState.value.concern,
  set: (value) => {
    formState.value.concern = capitalizeAll(value);
  },
});

const contactNumberComputed = computed({
  get: () => formState.value.contact_number ?? undefined,
  set: (value: string | undefined) => {
    formState.value.contact_number = value ?? undefined;
  },
});

const fullNameComputed = computed({
  get: () => formState.value.full_name ?? undefined,
  set: (value: string | undefined) => {
    formState.value.full_name = capitalizeAll(value) ?? undefined;
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateTicketValidationSchema>
) => {
  await ticketStore.addTicket(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const itemOptions = ref<TItemSelectOption[]>([]);
const itemSearchQuery = ref("");

const searchItems = async (q: string) => {
  itemSearchQuery.value = q;
  if (!itemSearchQuery.value || itemSearchQuery.value.length < 2) return [];
  const result = await itemStore.fetchItemSearch(itemSearchQuery.value);
  itemOptions.value = result;
  return result;
};

const searchItemTypes = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (itemTypeSelect.value.length === 0) {
    await itemTypeStore.fetchItemTypeSelect();
  }
  return itemTypeSelect.value.filter((itemType) =>
    itemType.type.toLowerCase().includes(q.toLowerCase())
  );
};

const agencyOptions = ref<TAgencySelectOption[]>([]);
const agencySearchQuery = ref("");

const searchAgencies = async (q: string) => {
  agencySearchQuery.value = q;
  if (!agencySearchQuery.value || agencySearchQuery.value.length < 2) return [];
  const result = await agencyStore.fetchAgencySearch(agencySearchQuery.value);
  agencyOptions.value = result;
  return result;
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
              <span v-if="agencySearchQuery.length < 2" class="text-gray-400"
                >Type at least 2 characters...</span
              >
              <span v-else class="text-gray-400">No Agency found</span>
            </template>
          </UInputMenu>
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
      </div>

      <UFormGroup
        v-if="formState.is_other_agency"
        label="Full Name"
        name="full_name"
        :error="errorBag.full_name"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInput v-model="fullNameComputed" />
      </UFormGroup>

      <UFormGroup
        v-if="!formState.is_other_agency"
        label="Item"
        name="item"
        :error="errorBag.item"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInputMenu
          v-model="formState.item"
          :search="searchItems"
          :loading="loadingItems"
          placeholder="Search by property number..."
          option-attribute="property_number"
        >
          <template #option="{ option }">
            <span class="truncate"
              >{{ option.property_number }} ({{
                option.brand_model.brand.name
              }}
              {{ option.brand_model.name }})</span
            >
            <!-- <span class="truncate"
              >{{ option.property_number }} ({{
                option.brand_model.item_type.type
              }}: {{ option.brand_model.brand.name }}
              {{ option.brand_model.name }})</span
            > -->
          </template>

          <template #empty>
            <span v-if="itemSearchQuery.length < 2" class="text-gray-400"
              >Type at least 2 characters...</span
            >
            <span v-else class="text-gray-400">No Item found</span>
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
        <UInput v-model="concernComputed" />
      </UFormGroup>

      <UFormGroup
        label="Contact Number (Optional)"
        name="contact_number"
        :error="errorBag.contact_number"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UButtonGroup
          orient="horizontal"
          :ui="{
            wrapper: { horizontal: 'w-full' },
          }"
        >
          <UInput v-model="contactNumberComputed" class="flex-1" />
        </UButtonGroup>
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
