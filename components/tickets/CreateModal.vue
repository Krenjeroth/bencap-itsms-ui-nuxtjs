<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, priorities } = storeToRefs(ticketStore);

const employeeStore = useEmployeeStore();
const { loading: loadingEmployees } = storeToRefs(employeeStore);

const itemStore = useItemStore();
const { loading: loadingItems } = storeToRefs(itemStore);

const itServiceStore = useItServiceStore();
const { itServiceSelect } = storeToRefs(itServiceStore);
itServiceStore.fetchItServicesSelect();

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
  employee: undefined,
  item: undefined,
  it_service: undefined,
  concern: undefined,
  priority: "low",
});

const concernComputed = computed({
  get: () => formState.value.concern,
  set: (value) => {
    formState.value.concern = capitalizeAll(value);
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
                option.brand_model.item_type.type
              }}: {{ option.brand_model.brand.name }}
              {{ option.brand_model.name }})</span
            >
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

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
