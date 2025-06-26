<script setup lang="ts">
import { cloneDeep } from "lodash";
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, priorities } = storeToRefs(ticketStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

const itemStore = useItemStore();
const { loading: loadingItems } = storeToRefs(itemStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const itServiceStore = useItServiceStore();
const { itServiceSelect } = storeToRefs(itServiceStore);
itServiceStore.fetchItServicesSelect();

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

const props = defineProps({
  pageTitle: String,
  ticket: Object,
});

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

const onNoDataChange = () => {
  emit("noDataChange");
};

const formState = ref<IUpdateTicketForm>({
  employee: props.ticket?.employee || undefined,
  item: props.ticket?.item || undefined,
  item_type: props.ticket?.item_type?.id || undefined,
  it_service: props.ticket?.it_service.id || undefined,
  concern: props.ticket?.concern || undefined,
  priority: props.ticket?.priority || "low",
});

const originalState = ref<IUpdateTicketForm>({
  ...cloneDeep({
    employee: props.ticket?.employee || undefined,
    item: props.ticket?.item || undefined,
    item_type: props.ticket?.item_type?.id || undefined,
    it_service: props.ticket?.it_service.id || undefined,
    concern: props.ticket?.concern || undefined,
    priority: props.ticket?.priority || "low",
  }),
});

const fieldsToCompare: (keyof IUpdateTicketForm)[] = [
  "employee",
  "item",
  "item_type",
  "it_service",
  "concern",
  "priority",
];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const concernComputed = computed({
  get: () => formState.value.concern,
  set: (value) => {
    formState.value.concern = capitalizeAll(value);
  },
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateTicketValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await ticketStore.updateTicket(props.ticket?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
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
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Update ${props.pageTitle}`">
    <UForm
      :schema="UpdateTicketValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup
        label="Employee"
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

      <UFormGroup
        label="Item"
        name="item"
        :error="errorBag.item"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInputMenu
          v-model="formState.item"
          :search="searchItems"
          :loading="loadingItems"
          placeholder="Type to search by property number..."
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
        label="IT Service"
        name="it_service"
        :error="errorBag.it_service"
      >
        <USelect
          v-model="formState.it_service"
          :options="itServiceSelect"
          value-attribute="id"
          option-attribute="name"
          placeholder="Select"
        />
      </UFormGroup>

      <UFormGroup label="Concern" name="concern" :error="errorBag.concern">
        <UInput v-model="concernComputed" />
      </UFormGroup>

      <UFormGroup label="Priority" name="priority" :error="errorBag.priority">
        <USelect
          v-model="formState.priority"
          :options="priorities"
          value-attribute="value"
          option-attribute="label"
          placeholder="Select"
        />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
