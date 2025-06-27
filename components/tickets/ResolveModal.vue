<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, errorBag, hasError, serviceMethodOptions } =
  storeToRefs(ticketStore);

const itemTypeStore = useItemTypeStore();
const { loading: loadingItemTypes, itemTypeSelect } =
  storeToRefs(itemTypeStore);
itemTypeStore.fetchItemTypeSelect();

const solutionStore = useSolutionStore();
const { loading: loadingSolutions, solutionSelect } =
  storeToRefs(solutionStore);
solutionStore.fetchSolutionSelect();

const loadingSolution = ref(false);

const { user } = useSanctumAuth<IUser>();

const selectedSolution = ref<any>(null);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const props = defineProps({
  pageTitle: String,
  ticket: Object,
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

const formState = ref<IResolveTicketForm>({
  solution: undefined,
});

const handleSubmit = async (
  event: IFormSubmitEvent<TResolveTicketValidationSchema>
) => {
  console.log(event.data);
  // await ticketStore.resolveTicket(props.ticket?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const solutionModel = computed({
  get: () => selectedSolution.value,
  set: async (value: any) => {
    if (typeof value === "string") {
      loadingSolution.value = true;

      const form = {
        description: value,
        author_id: user.value?.profile.id,
        item_type_id: props.ticket?.item_type.id,
      };

      try {
        const newSolution = await solutionStore.addSolutionSelect(form);
        solutionStore.solutionSelect.push(newSolution);
        selectedSolution.value = newSolution;
        formState.value.solution = newSolution.id;
      } finally {
        loadingSolution.value = false;
      }
    } else {
      selectedSolution.value = value;
      formState.value.solution = value.id;
    }
  },
});
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Resolve this ${props.pageTitle}?`">
    <UForm
      :schema="ResolveTicketValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup
        label="Solution"
        name="solution"
        :error="errorBag.solution"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <USelectMenu
          v-model="solutionModel"
          :options="solutionSelect"
          option-attribute="description"
          value-attribute="id"
          by="id"
          searchable
          creatable
          :loading="loadingSolution"
          placeholder="Select or create solution"
        />
      </UFormGroup>

      <UButton
        type="submit"
        variant="outline"
        color="green"
        class="w-full justify-center mt-4"
        :ui="{ base: 'text-center' }"
        :loading="loading"
      >
        I'm sure! This {{ props.pageTitle }} is Resolved.
      </UButton>
    </UForm>
  </BaseModal>
</template>
