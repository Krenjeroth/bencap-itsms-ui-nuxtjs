<script setup lang="ts">
import { cloneDeep } from "lodash";

const store = useOtherItServiceRequestsStore();
const { loading, errorBag, hasError } = storeToRefs(store);

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);
const props = defineProps({ pageTitle: String, request: Object });

const onClose = () => emit("close");
const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};
const onError = () => emit("error");
const onNoDataChange = () => emit("noDataChange");

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
  { label: "Cancelled", value: "cancelled" },
];

const formState = ref<IUpdateOtherItServiceRequestForm>({
  control_number: props.request?.control_number || undefined,
  status: props.request?.status || "pending",
  date_of_request: props.request?.date_of_request || undefined,
  department_office: props.request?.department_office || undefined,
  requestor_name: props.request?.requestor_name || undefined,
  service_printing: props.request?.service_printing ?? false,
  service_information_material:
    props.request?.service_information_material ?? false,
  service_program_paper: props.request?.service_program_paper ?? false,
  service_brochure: props.request?.service_brochure ?? false,
  service_iec_material: props.request?.service_iec_material ?? false,
  service_handbook: props.request?.service_handbook ?? false,
  service_certificates: props.request?.service_certificates ?? false,
  service_others: props.request?.service_others ?? false,
  service_qty: props.request?.service_qty || undefined,
  service_laptop_tv_setup: props.request?.service_laptop_tv_setup ?? false,
  service_others_specify: props.request?.service_others_specify || undefined,
  program_activity_details:
    props.request?.program_activity_details || undefined,
  activity_date_text: props.request?.activity_date_text || undefined,
  activity_time: props.request?.activity_time || undefined,
  assigned_personnel: props.request?.assigned_personnel || undefined,
  date_received: props.request?.date_received || undefined,
  action_taken: props.request?.action_taken || undefined,
  feedback_rating: props.request?.feedback_rating || undefined,
  feedback_name: props.request?.feedback_name || undefined,
  feedback_date: props.request?.feedback_date || undefined,
});

const originalState = ref(cloneDeep(formState.value));

const fieldsToCompare: (keyof IUpdateOtherItServiceRequestForm)[] = [
  "control_number",
  "status",
  "date_of_request",
  "department_office",
  "requestor_name",
  "service_printing",
  "service_information_material",
  "service_program_paper",
  "service_brochure",
  "service_iec_material",
  "service_handbook",
  "service_certificates",
  "service_others",
  "service_qty",
  "service_laptop_tv_setup",
  "service_others_specify",
  "program_activity_details",
  "activity_date_text",
  "activity_time",
  "assigned_personnel",
  "date_received",
  "action_taken",
  "feedback_rating",
  "feedback_name",
  "feedback_date",
];

const isChangedComputed = computed(() =>
  fieldsToCompare.some(
    (key) => !isEqual(formState.value[key], originalState.value[key]),
  ),
);

const handleSubmit = async (event: any) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }
  await store.updateRequest(props.request?.id, event.data);
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
    :title="`Update ${props.pageTitle ?? 'Other IT Service Request'}`"
  >
    <UForm
      :schema="UpdateOtherItServiceRequestValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <!-- Status + Control No -->
      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between"
      >
        <UFormGroup
          label="Status"
          name="status"
          :error="errorBag.status"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelect v-model="formState.status" :options="statusOptions" />
        </UFormGroup>

        <UFormGroup
          label="Control No. (Optional)"
          name="control_number"
          :error="errorBag.control_number"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.control_number" />
        </UFormGroup>
      </div>

      <!-- Date + Requestor Info -->
      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between"
      >
        <UFormGroup
          label="Date of Request"
          name="date_of_request"
          :error="errorBag.date_of_request"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.date_of_request" type="date" />
        </UFormGroup>

        <UFormGroup
          label="Department/Office"
          name="department_office"
          :error="errorBag.department_office"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.department_office" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Name of Requestor"
        name="requestor_name"
        :error="errorBag.requestor_name"
      >
        <UInput v-model="formState.requestor_name" />
      </UFormGroup>

      <!-- Services -->
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Service Requested
        </p>
        <div class="grid grid-cols-2 gap-2">
          <UCheckbox
            v-model="formState.service_printing"
            label="Printing Services"
          />
          <UCheckbox
            v-model="formState.service_information_material"
            label="Information Material"
          />
          <UCheckbox
            v-model="formState.service_program_paper"
            label="Program Paper"
          />
          <UCheckbox v-model="formState.service_brochure" label="Brochure" />
          <UCheckbox
            v-model="formState.service_iec_material"
            label="IEC Material"
          />
          <UCheckbox v-model="formState.service_handbook" label="Handbook" />
          <UCheckbox
            v-model="formState.service_certificates"
            label="Certificates"
          />
          <div class="flex items-center gap-2">
            <UCheckbox v-model="formState.service_others" label="Others" />
          </div>
          <UCheckbox
            v-model="formState.service_laptop_tv_setup"
            label="Set-up of laptop/TV for Meetings/Activities"
            class="items-center"
          />
          <UInput
            v-model.number="formState.service_qty"
            type="number"
            placeholder="Qty"
            class="w-20"
            min="1"
          />
        </div>

        <UFormGroup
          v-if="formState.service_others"
          label="Others (Please Specify)"
          name="service_others_specify"
          :error="errorBag.service_others_specify"
          class="mt-3"
        >
          <UInput
            v-if="formState.service_others"
            v-model="formState.service_others_specify"
          />
        </UFormGroup>
      </div>

      <!-- Activity Details -->
      <UFormGroup
        label="Program/Activity Details"
        name="program_activity_details"
        :error="errorBag.program_activity_details"
      >
        <UTextarea v-model="formState.program_activity_details" autoresize />
      </UFormGroup>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between"
      >
        <UFormGroup
          label="Date of Activity"
          name="activity_date_text"
          :error="errorBag.activity_date_text"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UTooltip
            text="e.g. January 01, 02, and 05, 2026"
            :popper="{ placement: 'top' }"
            class="w-full"
          >
            <UInput v-model="formState.activity_date_text" class="w-full" />
          </UTooltip>
        </UFormGroup>

        <UFormGroup
          label="Time of Activity"
          name="activity_time"
          :error="errorBag.activity_time"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UTooltip
            text="e.g. 8:30 AM"
            :popper="{ placement: 'top' }"
            class="w-full"
          >
            <UInput v-model="formState.activity_time" class="w-full" />
          </UTooltip>
        </UFormGroup>
      </div>

      <!-- IT/MIS Office Use -->
      <p
        class="text-sm font-semibold text-gray-700 dark:text-gray-200 border-t pt-4"
      >
        For IT/MIS Office Use
      </p>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between"
      >
        <UFormGroup
          label="Assigned Personnel"
          name="assigned_personnel"
          :error="errorBag.assigned_personnel"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.assigned_personnel" />
        </UFormGroup>

        <UFormGroup
          label="Date Received"
          name="date_received"
          :error="errorBag.date_received"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.date_received" type="date" />
        </UFormGroup>
      </div>

      <UFormGroup
        label="Action Taken"
        name="action_taken"
        :error="errorBag.action_taken"
      >
        <UTextarea v-model="formState.action_taken" autoresize />
      </UFormGroup>

      <!-- Feedback -->
      <p
        class="text-sm font-semibold text-gray-700 dark:text-gray-200 border-t pt-4"
      >
        Requestor's Feedback
      </p>

      <div
        class="space-y-6 space-x-0 md:space-y-0 md:space-x-6 md:flex md:justify-between"
      >
        <UFormGroup
          label="Rating (1–5)"
          name="feedback_rating"
          :error="errorBag.feedback_rating"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelect
            v-model.number="formState.feedback_rating"
            :options="[
              { label: '5 — Very Satisfied', value: 5 },
              { label: '4 — Satisfied', value: 4 },
              { label: '3 — Neutral', value: 3 },
              { label: '2 — Dissatisfied', value: 2 },
              { label: '1 — Very Dissatisfied', value: 1 },
            ]"
            placeholder="Select rating"
          />
        </UFormGroup>

        <UFormGroup
          label="Feedback Name"
          name="feedback_name"
          :error="errorBag.feedback_name"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.feedback_name" />
        </UFormGroup>

        <UFormGroup
          label="Feedback Date"
          name="feedback_date"
          :error="errorBag.feedback_date"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.feedback_date" type="date" />
        </UFormGroup>
      </div>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
