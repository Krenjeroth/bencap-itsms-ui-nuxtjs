<script setup lang="ts">
const ticketStore = useTicketStore();
const { loading, errorBag, hasError } = storeToRefs(ticketStore);

const solutionStore = useSolutionStore();
const { loading: loadingSolutions, solutionSelect } =
  storeToRefs(solutionStore);
solutionStore.fetchSolutionSelect();

const loadingSolution = ref(false);

const { user } = useSanctumAuth<IUser>();

const selectedSolution = ref<any>(null);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const props = defineProps<{
  pageTitle: string;
  ticket: any;
}>();

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
  event: IFormSubmitEvent<TResolveTicketValidationSchema>,
) => {
  await ticketStore.resolveTicket(props.ticket?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
};

const createSolution = async (title: string) => {
  loadingSolution.value = true;

  const form = {
    title,
    author_id: user.value?.profile.id,
  };

  try {
    const newSolution = await solutionStore.addSolutionSelect(form);
    solutionStore.solutionSelect.push(newSolution);
    selectedSolution.value = newSolution;
    formState.value.solution = newSolution.id;
  } catch (err) {
    console.error("Failed to create solution", err);
  } finally {
    loadingSolution.value = false;
  }
};

const solutionModel = computed({
  get: () => selectedSolution.value,
  set: async (sol: any) => {
    if (!sol) {
      selectedSolution.value = null;
      formState.value.solution = undefined;
      return;
    }

    if (typeof sol === "string") {
      return await createSolution(sol);
    }

    if (sol && !sol.id && typeof sol.title === "string") {
      return await createSolution(sol.title);
    }

    selectedSolution.value = sol;
    formState.value.solution =
      typeof sol === "number" ? { id: sol } : undefined;
  },
});

watch(selectedSolution, (sol) => {
  formState.value.solution = sol ?? undefined;
});
</script>

<template>
  <BaseModal :on-close="onClose" :title="`Resolve ${props.pageTitle}`">
    <!-- Ticket summary -->
    <div class="space-y-4 mb-4">
      <div
        class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
      >
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Ticket details
        </p>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Ticket number</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.ticket_number }}
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Assistance type</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.it_service?.name }}
            <span v-if="props.ticket?.it_service?.code">
              ({{ props.ticket?.it_service?.code }})
            </span>
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Current status</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.query_status_formatted }}
            · {{ props.ticket?.request_status_formatted }}
          </span>
        </div>
      </div>

      <div
        class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
      >
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {{
            props.ticket?.is_other_agency
              ? "Client information"
              : "Inventory owner"
          }}
        </p>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">
            {{ props.ticket?.is_other_agency ? "Client name" : "Name" }}
          </span>
          <span class="italic text-right break-words">
            {{ props.ticket?.full_name || props.ticket?.client_name || "—" }}
          </span>
        </div>

        <div
          v-if="props.ticket?.is_other_agency"
          class="flex justify-between gap-3 text-sm"
        >
          <span class="font-medium shrink-0">Agency</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.agency?.name }}
            <span v-if="props.ticket?.agency?.abbreviation">
              ({{ props.ticket?.agency?.abbreviation }})
            </span>
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Item type</span>
          <span class="italic text-right break-words">
            {{
              props.ticket?.item_type_label ||
              props.ticket?.item_type?.type ||
              "—"
            }}
          </span>
        </div>

        <div class="flex justify-between gap-3 text-sm">
          <span class="font-medium shrink-0">Property number</span>
          <span class="italic text-right break-words">
            {{ props.ticket?.property_number || "—" }}
          </span>
        </div>
      </div>

      <div
        class="border border-gray-200 dark:border-gray-700 rounded-md p-3 space-y-2"
      >
        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Concern
        </p>
        <p class="text-sm italic break-words text-gray-800 dark:text-gray-100">
          {{ props.ticket?.concern }}
        </p>
      </div>
    </div>

    <UForm
      :schema="ResolveTicketValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-4"
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
          option-attribute="title"
          searchable
          creatable
          :loading="loadingSolution || loadingSolutions"
          placeholder="Select or create solution"
        >
          <template #option="{ option }">
            <span>
              {{ option.title }} —
              <span class="italic">
                {{ option.author.display_name }}
              </span>
            </span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <p class="text-xs text-gray-500 dark:text-gray-400">
        Choose or create a solution that describes how this
        {{ props.pageTitle.toLowerCase() }} was resolved. This will mark the
        ticket as <span class="font-semibold">Resolved</span>.
      </p>

      <UButton
        type="submit"
        variant="outline"
        color="green"
        class="w-full justify-center mt-2"
        :ui="{ base: 'text-center' }"
        :loading="loading"
      >
        Confirm resolve
      </UButton>
    </UForm>
  </BaseModal>
</template>
