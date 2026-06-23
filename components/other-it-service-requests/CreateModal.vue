<script setup lang="ts">
const store = useOtherItServiceRequestsStore();
const { loading, errorBag, hasError } = storeToRefs(store);

const emit = defineEmits(["reloadTable", "success", "error", "close"]);
const props = defineProps({ pageTitle: String });

const onClose = () => emit("close");
const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};
const onError = () => emit("error");

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
  { label: "Cancelled", value: "cancelled" },
];

const formState = ref<ICreateOtherItServiceRequestForm>({
  control_number: undefined,
  status: "pending",
  date_of_request: undefined,
  department_office: undefined,
  requestor_name: undefined,
  service_printing: false,
  service_information_material: false,
  service_program_paper: false,
  service_brochure: false,
  service_iec_material: false,
  service_handbook: false,
  service_certificates: false,
  service_others: false,
  service_qty: undefined,
  service_laptop_tv_setup: false,
  service_others_specify: undefined,
  program_activity_details: undefined,
  activity_date_text: undefined,
  activity_time: undefined,
});

const handleSubmit = async (event: any) => {
  await store.addRequest(event.data);
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
    :title="`Create ${props.pageTitle ?? 'Other IT Service Request'}`"
  >
    <UForm
      :schema="CreateOtherItServiceRequestValidationSchema"
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

      <UButton type="submit" :loading="loading">Add</UButton>
    </UForm>
  </BaseModal>
</template>
