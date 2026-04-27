<script setup lang="ts">
import { cloneDeep, isEqual } from "lodash";

const userStore = useUserStore();
const { loading, errorBag, hasError, genderOptions } = storeToRefs(userStore);

const roleStore = useRoleStore();
const { roleSelect } = storeToRefs(roleStore);

const { strDeepSanitize, capitalizeAll } = useStringHandler();

roleStore.getRoleSelect();

const officeStore = useOfficeStore();
const { loading: loadingOffices, officeSelect } = storeToRefs(officeStore);

const agencyStore = useAgencyStore();
const { loading: loadingAgencies, agencySelect } = storeToRefs(agencyStore);

const props = defineProps({
  user: Object,
});

const emit = defineEmits([
  "reloadTable",
  "success",
  "error",
  "noDataChange",
  "close",
]);

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

const normalizeSelectedOffice = (office: any) => ({
  id: String(office.id),
  office_code: office.office_code ?? office.abbreviation ?? null,
  office_desc: office.office_desc ?? null,
  abbreviation: office.abbreviation ?? office.office_code ?? null,
  label:
    office.label ??
    (office.office_code && office.office_desc
      ? `${office.office_code} - ${office.office_desc}`
      : (office.abbreviation ?? office.office_code ?? office.office_desc)),
});

const formState = ref<IUpdateUserForm>({
  email: props.user?.email ?? undefined,
  role: props.user?.roles[0]?.id ?? undefined,
  prefix: strDeepSanitize(props.user?.profile?.name?.prefix) || undefined,
  firstname: props.user?.profile?.name?.firstname ?? undefined,
  middlename: props.user?.profile?.name?.middlename ?? undefined,
  lastname: props.user?.profile?.name?.lastname ?? undefined,
  suffix: strDeepSanitize(props.user?.profile?.name?.suffix) || undefined,
  gender: props.user?.profile?.gender ?? undefined,
  designation: props.user?.profile?.designation ?? undefined,
  img_path: props.user?.profile?.img_path ?? undefined,
  photo_id: null,
  offices_assigned_ids: (props.user?.offices_assigned_ids ?? []).map(
    (id: any) => Number(id),
  ),
  agencies_assigned_ids: props.user?.agencies_assigned_ids ?? [],
});

const selectedOfficeIds = computed(() =>
  (props.user?.offices_assigned_ids ?? []).map((id: any) => String(id)),
);

const officesAssignedPayloadComputed = computed(() => {
  return (selectedOfficeOptions.value || []).map((office: any) => ({
    id: String(office.id),
    office_code: office.office_code ?? office.abbreviation ?? null,
    office_desc: office.office_desc ?? null,
    abbreviation: office.abbreviation ?? office.office_code ?? null,
    label:
      office.label ??
      (office.office_code && office.office_desc
        ? `${office.office_code} - ${office.office_desc}`
        : (office.abbreviation ?? office.office_code ?? office.office_desc)),
  }));
});

const originalState = ref(
  cloneDeep({
    email: props.user?.email ?? undefined,
    role: props.user?.roles[0]?.id ?? undefined,
    prefix: strDeepSanitize(props.user?.profile?.name?.prefix) || undefined,
    firstname: props.user?.profile?.name?.firstname ?? undefined,
    middlename: props.user?.profile?.name?.middlename ?? undefined,
    lastname: props.user?.profile?.name?.lastname ?? undefined,
    suffix: strDeepSanitize(props.user?.profile?.name?.suffix) || undefined,
    gender: props.user?.profile?.gender ?? undefined,
    designation: props.user?.profile?.designation ?? undefined,
    img_path: props.user?.profile?.img_path ?? undefined,
    photo_id: null,
    offices_assigned_ids: [...(props.user?.offices_assigned_ids ?? [])]
      .map(Number)
      .sort((a, b) => a - b),
    agencies_assigned_ids: props.user?.agencies_assigned_ids ?? [],
  }),
);

const normalizeUpdateState = (source: any) => ({
  email: source.email ?? undefined,
  role: source.role ?? undefined,
  prefix: source.prefix ?? undefined,
  firstname: source.firstname ?? undefined,
  middlename: source.middlename ?? undefined,
  lastname: source.lastname ?? undefined,
  suffix: source.suffix ?? undefined,
  gender: source.gender ?? undefined,
  designation: source.designation ?? undefined,
  img_path: source.img_path ?? undefined,
  photo_id: source.photo_id ?? null,
  agencies_assigned_ids: [...(source.agencies_assigned_ids ?? [])]
    .map(Number)
    .sort((a, b) => a - b),
  offices_assigned_ids: [...(source.offices_assigned_ids ?? [])]
    .map(Number)
    .sort((a, b) => a - b),
});

const filePreview = ref<string | null>(null);
const zodValidationError = ref<string | null>(null);

const prefixComputed = computed({
  get: () => formState.value.prefix ?? undefined,
  set: (value) => (formState.value.prefix = value || undefined),
});

const suffixComputed = computed({
  get: () => formState.value.suffix ?? undefined,
  set: (value) => (formState.value.suffix = value || undefined),
});

const genderComputed = computed({
  get: () => formState.value.gender ?? undefined,
  set: (value) => (formState.value.gender = value || undefined),
});

const designationComputed = computed({
  get: () => formState.value.designation ?? undefined,
  set: (value) =>
    (formState.value.designation = capitalizeAll(value) || undefined),
});

const roleComputed = computed({
  get: () => formState.value.role ?? undefined,
  set: (value) => (formState.value.role = value ? Number(value) : undefined),
});

const agenciesAssignedComputed = computed({
  get: () => formState.value.agencies_assigned_ids ?? undefined,
  set: (value) => (formState.value.agencies_assigned_ids = value || []),
});

const normalizeOfficeOption = (office: any) => ({
  id: Number(office.id),
  office_code: office.office_code ?? office.abbreviation ?? null,
  office_desc: office.office_desc ?? null,
  abbreviation: office.abbreviation ?? office.office_code ?? null,
  label:
    office.label ??
    office.office_code ??
    office.abbreviation ??
    office.office_desc,
});

const selectedOfficeIdsSet = computed(() => {
  return new Set(
    (formState.value.offices_assigned_ids ?? []).map((id: any) => Number(id)),
  );
});

const selectedOfficeOptions = computed({
  get: () => {
    const ids = selectedOfficeIdsSet.value;
    return (officeSelect.value || []).filter((office: any) =>
      ids.has(Number(office.id)),
    );
  },
  set: (value) => {
    formState.value.offices_assigned_ids = (value || []).map((office: any) =>
      Number(office.id),
    );
  },
});

const selectedOfficeCodes = computed(() => {
  const ids = selectedOfficeIdsSet.value;

  const codesFromOptions = (officeSelect.value || [])
    .filter((office: any) => ids.has(Number(office.id)))
    .map(
      (office: any) =>
        office.office_code ?? office.abbreviation ?? office.label ?? office.id,
    );

  if (codesFromOptions.length) return codesFromOptions;

  return (props.user?.offices_assigned || []).map(
    (office: any) =>
      office.office_code ?? office.abbreviation ?? office.label ?? office.id,
  );
});

const selectedOfficeDisplayLabel = computed(() => {
  const codes = selectedOfficeCodes.value;
  const count = codes.length;

  if (count === 0) return "";
  if (count <= 2) return codes.join(", ");
  return `${codes.slice(0, 2).join(", ")} +${count - 2} more`;
});

filePreview.value = props.user?.profile?.img_path ?? null;

const handlePhotoUpload = (files: FileList | null) => {
  if (!files || files.length === 0) {
    formState.value.photo_id = null;
    filePreview.value = null;
    zodValidationError.value = null;
    return;
  }

  const file = files[0];
  const zodValidationResult = CreatePhotoIdSchema.safeParse(file);

  if (!zodValidationResult.success) {
    zodValidationError.value =
      zodValidationResult.error.format()._errors[0] || "Invalid file.";
    filePreview.value = null;
    formState.value.photo_id = null;
    return;
  }

  zodValidationError.value = null;
  formState.value.photo_id = file;
  filePreview.value = URL.createObjectURL(file);
};

const fieldsToCompare: (keyof IUpdateUserForm)[] = [
  "email",
  "role",
  "prefix",
  "firstname",
  "middlename",
  "lastname",
  "suffix",
  "gender",
  "designation",
  "img_path",
  "photo_id",
  "offices_assigned_ids",
  "agencies_assigned_ids",
];

const isChangedComputed = computed(() => {
  const current = normalizeUpdateState(formState.value);
  const original = normalizeUpdateState({
    email: props.user?.email,
    role: props.user?.roles[0]?.id,
    prefix: strDeepSanitize(props.user?.profile?.name?.prefix) || undefined,
    firstname: props.user?.profile?.name?.firstname ?? undefined,
    middlename: props.user?.profile?.name?.middlename ?? undefined,
    lastname: props.user?.profile?.name?.lastname ?? undefined,
    suffix: strDeepSanitize(props.user?.profile?.name?.suffix) || undefined,
    gender: props.user?.profile?.gender ?? undefined,
    designation: props.user?.profile?.designation ?? undefined,
    img_path: props.user?.profile?.img_path ?? undefined,
    photo_id: null,
    offices_assigned_ids: props.user?.offices_assigned_ids ?? [],
    agencies_assigned_ids: props.user?.agencies_assigned_ids ?? [],
  });

  return !isEqual(current, original);
});

const hydrateSelectedOfficesFromOptions = () => {
  const options = officeSelect.value || [];
  const ids = selectedOfficeIds.value;

  if (!options.length || !ids.length) {
    selectedOfficeOptions.value = [];
    return;
  }

  selectedOfficeOptions.value = options
    .filter((office: any) => ids.includes(String(office.id)))
    .map((office: any) => normalizeSelectedOffice(office));
};

watch(
  officeSelect,
  () => {
    hydrateSelectedOfficesFromOptions();
  },
  { immediate: true, deep: true },
);

onMounted(async () => {
  await officeStore.fetchOfficeSelect();
  await agencyStore.fetchAgencySelect();

  const merged = [...(officeSelect.value || [])];

  (props.user?.offices_assigned || []).forEach((saved: any) => {
    const normalized = normalizeOfficeOption(saved);
    if (
      !merged.find((item: any) => String(item.id) === String(normalized.id))
    ) {
      merged.push(normalized);
    }
  });

  officeSelect.value = merged;
});
const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateUserValidationSchema>,
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  const payload = {
    ...event.data,
    offices_assigned: officesAssignedPayloadComputed.value,
  };

  await userStore.updateUser(props.user?.id, payload as any);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
};

const searchOffices = async (q: string) => {
  if (!q || q.length < 2) {
    return officeSelect.value;
  }

  const result = await officeStore.fetchOfficeSearch(q);

  const merged = [...result];

  (props.user?.offices_assigned || []).forEach((saved: any) => {
    const normalized = normalizeOfficeOption(saved);
    if (
      !merged.find((item: any) => String(item.id) === String(normalized.id))
    ) {
      merged.push(normalized);
    }
  });

  return merged;
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

watch(roleComputed, (val) => {
  if (val === 2) {
    selectedOfficeOptions.value = [];
    formState.value.offices_assigned_ids = [];
  }
});

watch(roleComputed, (val) => {
  if (val === 3) {
    formState.value.agencies_assigned_ids = [];
  }
});
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="'Edit User'"
    :ui="{ width: 'md:max-w-3xl' }"
  >
    <UForm
      :schema="UpdateUserValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
      @error="console.log($event)"
    >
      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Email"
          name="email"
          :error="errorBag.email"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.email" />
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Designation"
          name="designation"
          :error="errorBag.designation"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="designationComputed" />
        </UFormGroup>

        <UFormGroup
          label="Role"
          name="role"
          :error="errorBag.role"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelect
            v-model="formState.role"
            :options="roleSelect"
            value-attribute="id"
            option-attribute="title"
            placeholder="Select"
          />
        </UFormGroup>

        <UFormGroup
          label="Gender"
          name="gender"
          :error="errorBag.gender"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <USelect
            v-model="genderComputed"
            :options="genderOptions"
            value-attribute="value"
            option-attribute="label"
            placeholder="Select"
          />
        </UFormGroup>
      </div>

      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <UFormGroup
          label="Prefix"
          name="prefix"
          :error="errorBag.prefix"
          :ui="{ wrapper: 'md:w-30' }"
        >
          <UInput v-model="prefixComputed" />
        </UFormGroup>
        <UFormGroup
          label="Firstname"
          name="firstname"
          :error="errorBag.firstname"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.firstname" />
        </UFormGroup>
        <UFormGroup
          label="Middlename"
          name="middlename"
          :error="errorBag.middlename"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.middlename" />
        </UFormGroup>
        <UFormGroup
          label="Lastname"
          name="lastname"
          :error="errorBag.lastname"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.lastname" />
        </UFormGroup>
        <UFormGroup
          label="Suffix"
          name="suffix"
          :error="errorBag.suffix"
          :ui="{ wrapper: 'md:w-30' }"
        >
          <UInput v-model="suffixComputed" />
        </UFormGroup>
      </div>

      <!-- <div v-if="roleComputed === 2" class="space-y-6"> -->
      <div class="space-y-6">
        <UDivider label="Offices / Agencies Assigned" />
        <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
          <UFormGroup
            label="Offices"
            name="offices_assigned_ids"
            :error="errorBag.offices_assigned_ids"
            :ui="{ wrapper: 'md:w-full' }"
            truncate
          >
            <USelectMenu
              v-model="selectedOfficeOptions"
              :options="officeSelect"
              searchable
              placeholder="Type to search..."
              by="id"
              multiple
            >
              <template #label>
                <span
                  v-if="selectedOfficeDisplayLabel"
                  class="block truncate pr-6"
                >
                  {{ selectedOfficeDisplayLabel }}
                </span>
                <span v-else class="text-gray-400 block truncate pr-6">
                  Type to search...
                </span>
              </template>

              <template #option="{ option }">
                <div
                  class="flex items-center justify-between w-full gap-3 truncate"
                >
                  <span class="truncate">{{ option.office_code }}</span>
                  <UIcon
                    v-if="selectedOfficeIdsSet.has(Number(option.id))"
                    name="i-heroicons-check-20-solid"
                    class="w-5 h-5 text-primary-500 shrink-0"
                  />
                </div>
              </template>

              <template #empty>No Office found</template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup
            label="Agencies"
            name="agencies_assigned_ids"
            :error="errorBag.agencies_assigned_ids"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <USelectMenu
              v-model="agenciesAssignedComputed"
              :options="agencySelect"
              :searchable="true"
              :search="searchAgencies"
              :loading="loadingAgencies"
              placeholder="Type to search..."
              value-attribute="id"
              option-attribute="abbreviation"
              multiple
            >
              <template #option-empty="{ query }">
                <q>{{ query }}</q> not found
              </template>

              <template #empty> No Agency found </template>
            </USelectMenu>
          </UFormGroup>
        </div>
      </div>

      <UFormGroup
        label="Photo ID"
        name="photo_id"
        :error="errorBag.photo_id"
        :ui="{ wrapper: 'md:w-full' }"
      >
        <UInput
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          icon="i-heroicons-photo"
          @change="handlePhotoUpload($event)"
          :multiple="false"
        />
        <p
          v-if="zodValidationError"
          class="mt-2 text-red-500 dark:text-red-400 text-sm"
        >
          {{ zodValidationError }}
        </p>
      </UFormGroup>

      <img
        v-if="filePreview && !zodValidationError"
        :src="filePreview"
        class="w-36 h-36 rounded-full"
        alt="Photo Preview"
      />

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
