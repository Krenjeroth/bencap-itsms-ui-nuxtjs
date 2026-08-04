<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash";

const ticketStore = useTicketStore();
const { loading, errorBag, hasError } = storeToRefs(ticketStore);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

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
const onError = () => emit("error");

const SYSTEM_UNIT_PARTS = [
  "PROCESSOR",
  "RAM/ Memory Module",
  "SOLID STATE DRIVE",
  "HARD DISK",
  "VIDEO CARD",
  "POWER SUPPLY",
  "MOTHERBOARD",
  "OPTICAL DRIVE",
  "MONITOR",
  "OTHERS (System Unit)",
];

const PERIPHERALS = [
  "KEYBOARD",
  "MOUSE",
  "SPEAKER",
  "USB/FLASHDRIVE",
  "AVR",
  "UPS",
  "PRINTER",
  "SCANNER",
  "Router / Switch",
  "OTHERS (Peripherals)",
];

const assessment = props.ticket?.assessment;

const formState = ref<IAssessTicketForm>({
  findings: assessment?.findings ?? "",
  recommendations: assessment?.recommendations ?? "",
  reviewed_by: assessment?.reviewed_by ?? "JENNY ROSE T. BORJA",
  reviewed_by_position:
    assessment?.reviewed_by_position ?? "INFORMATION SYSTEMS ANALYST III",
  replacement_available: Boolean(assessment?.replacement_available),
  specifications: assessment?.specifications ?? undefined,
  components: Array.isArray(assessment?.components)
    ? [...assessment.components]
    : [],
});

const originalState = ref<IAssessTicketForm>(
  cloneDeep({
    findings: assessment?.findings ?? "",
    recommendations: assessment?.recommendations ?? "",
    reviewed_by: assessment?.reviewed_by ?? "JENNY ROSE T. BORJA",
    reviewed_by_position:
      assessment?.reviewed_by_position ?? "INFORMATION SYSTEMS ANALYST III",
    replacement_available: Boolean(assessment?.replacement_available),
    specifications: assessment?.specifications ?? undefined,
    components: Array.isArray(assessment?.components)
      ? [...assessment.components]
      : [],
  }),
);

const isChangedComputed = computed(
  () => !isEqual(formState.value, originalState.value),
);

const hasExistingAssessment = computed(() => Boolean(props.ticket?.assessment));

const reviewedByComputed = computed({
  get: () => formState.value.reviewed_by,
  set: (value) => {
    formState.value.reviewed_by = capitalizeAll(value);
  },
});

const findingsComputed = computed({
  get: () => formState.value.findings,
  set: (value) => {
    formState.value.findings = capitalizeAll(value);
  },
});

const recommendationsComputed = computed({
  get: () => formState.value.recommendations,
  set: (value) => {
    formState.value.recommendations = capitalizeAll(value);
  },
});

const specificationsComputed = computed({
  get: () => formState.value.specifications,
  set: (value) => {
    formState.value.specifications = capitalizeAll(value);
  },
});

const toggleComponent = (name: string) => {
  const idx = formState.value.components!.indexOf(name);
  if (idx === -1) {
    formState.value.components!.push(name);
  } else {
    formState.value.components!.splice(idx, 1);
  }
};

const isChecked = (name: string) => formState.value.components!.includes(name);

const handleSubmit = async () => {
  await ticketStore.assessTicket(props.ticket?.id, formState.value);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
};
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="`${hasExistingAssessment ? 'Update' : 'IT Assessment'} — ${props.ticket?.ticket_number}`"
    size="xl"
  >
    <div class="space-y-5">
      <!-- {{-- Components --}} -->
      <div>
        <p class="text-sm font-medium text-gray-700 mb-2">
          Components Assessed
        </p>
        <div class="grid grid-cols-2 gap-x-6 gap-y-1">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase mb-1">
              System Unit
            </p>
            <div
              v-for="part in SYSTEM_UNIT_PARTS"
              :key="part"
              class="flex items-center gap-2 py-0.5"
            >
              <UCheckbox
                :model-value="isChecked(part)"
                @update:model-value="toggleComponent(part)"
                :label="part"
                :ui="{ label: 'text-sm' }"
              />
            </div>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase mb-1">
              Peripherals
            </p>
            <div
              v-for="part in PERIPHERALS"
              :key="part"
              class="flex items-center gap-2 py-0.5"
            >
              <UCheckbox
                :model-value="isChecked(part)"
                @update:model-value="toggleComponent(part)"
                :label="part"
                :ui="{ label: 'text-sm' }"
              />
            </div>
          </div>
        </div>
      </div>

      <UDivider />

      <!-- {{-- Findings --}} -->
      <UFormGroup label="Findings" name="findings" :error="errorBag.findings">
        <UTextarea
          v-model="findingsComputed"
          placeholder="Describe what was found..."
          :rows="3"
          autoresize
        />
      </UFormGroup>

      <!-- {{-- Recommendations --}} -->
      <UFormGroup
        label="Recommendations"
        name="recommendations"
        :error="errorBag.recommendations"
      >
        <UTextarea
          v-model="recommendationsComputed"
          placeholder="Describe recommended action..."
          :rows="3"
          autoresize
        />
      </UFormGroup>

      <!-- {{-- Replacement Available --}} -->
      <UFormGroup label="Replacement Parts" name="replacement_available">
        <div class="flex gap-4 mt-1">
          <URadio
            v-model="formState.replacement_available"
            :value="true"
            label="Available at IT Office"
          />
          <URadio
            v-model="formState.replacement_available"
            :value="false"
            label="No Available IT Stock"
          />
        </div>
      </UFormGroup>

      <!-- {{-- Specifications --}} -->
      <UFormGroup label="Specifications" name="specifications" hint="Optional">
        <UTextarea
          v-model="specificationsComputed"
          placeholder="Specify parts or details if needed..."
          :rows="2"
          autoresize
        />
      </UFormGroup>

      <!-- {{-- Reviewed By --}} -->
      <UFormGroup
        label="Reviewed By"
        name="reviewed_by"
        :error="errorBag.reviewed_by"
      >
        <UInput
          v-model="reviewedByComputed"
          placeholder="Full name of reviewer"
        />
      </UFormGroup>

      <UFormGroup
        label="Reviewed By Position"
        name="reviewed_by_position"
        :error="errorBag.reviewed_by_position"
      >
        <UInput
          v-model="formState.reviewed_by_position"
          placeholder="Position title of reviewer"
        />
      </UFormGroup>
      <UButton
        type="button"
        variant="outline"
        color="blue"
        class="w-full justify-center mt-2"
        :loading="loading"
        :disabled="
          !formState.findings ||
          !formState.recommendations ||
          !formState.reviewed_by ||
          (hasExistingAssessment && !isChangedComputed)
        "
        @click="handleSubmit"
      >
        {{
          hasExistingAssessment
            ? "Update IT Assessment"
            : "Submit IT Assessment"
        }}
      </UButton>
    </div>
  </BaseModal>
</template>
