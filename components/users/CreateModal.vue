<script setup lang="ts">
const userStore = useUserStore();
const { loading, errorBag, hasError, genderOptions } = storeToRefs(userStore);
const roleStore = useRoleStore();
const { roleSelect } = storeToRefs(roleStore);
const { capitalizeAll } = useStringHandler();
roleStore.getRoleSelect();

const departmentStore = useDepartmentStore();
const { loading: loadingDepartments, departmentSelect } =
  storeToRefs(departmentStore);
departmentStore.fetchDepartmentSelect();

const emit = defineEmits(["reloadTable", "success", "error", "close"]);

const onClose = () => emit("close");

const onSuccess = () => {
  emit("success");
  emit("reloadTable");
  onClose();
};

const onError = () => {
  emit("error");
};

const formState = ref<ICreateUserForm>({
  prefix: undefined,
  firstname: undefined,
  middlename: undefined,
  lastname: undefined,
  suffix: undefined,
  gender: undefined,
  designation: undefined,
  email: undefined,
  password: undefined,
  role: undefined,
  photo_id: null,
  offices_assigned_ids: [],
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

const officesAssignedComputed = computed({
  get: () => formState.value.offices_assigned_ids ?? undefined,
  set: (value) => (formState.value.offices_assigned_ids = value || []),
});

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

const handleSubmit = async (
  event: IFormSubmitEvent<TCreateUserValidationSchema>
) => {
  await userStore.addUser(event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};

const searchDepartments = async (q: string) => {
  if (!q || q.length < 2) return [];
  if (departmentSelect.value.length === 0) {
    await departmentStore.fetchDepartmentSelect();
  }
  return departmentSelect.value.filter((dept) =>
    dept.abbreviation.toLowerCase().includes(q.toLowerCase())
  );
};

watch(roleComputed, (val) => {
  if (val === 2) {
    formState.value.offices_assigned_ids = [];
  }
});
</script>

<template>
  <BaseModal
    :on-close="onClose"
    :title="'Create User'"
    :ui="{ width: 'md:max-w-3xl' }"
  >
    <UForm
      :schema="CreateUserValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
        <!-- <UFormGroup label="Name" name="name" :error="errorBag.name">
          <UInput v-model="formState.name" />
        </UFormGroup> -->

        <UFormGroup
          label="Email"
          name="email"
          :error="errorBag.email"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.email" />
        </UFormGroup>

        <UFormGroup
          label="Password"
          name="password"
          :error="errorBag.password"
          :ui="{ wrapper: 'md:w-full' }"
        >
          <UInput v-model="formState.password" type="password" />
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
            v-model="roleComputed"
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

      <div v-if="roleComputed === 2" class="space-y-6 md:space-y-0">
        <UDivider label="Offices / Agencies Assigned" />
        <div class="space-y-6 md:space-y-0 md:flex md:space-x-6">
          <UFormGroup
            label="Offices"
            name="offices_assigned_ids"
            :error="errorBag.offices_assigned_ids"
            :ui="{ wrapper: 'md:w-full' }"
          >
            <USelectMenu
              v-model="officesAssignedComputed"
              :options="departmentSelect"
              :searchable="true"
              :search="searchDepartments"
              :loading="loadingDepartments"
              placeholder="Type to search..."
              value-attribute="id"
              option-attribute="abbreviation"
              multiple
            >
              <template #option-empty="{ query }">
                <q>{{ query }}</q> not found
              </template>

              <template #empty> No Department found </template>
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

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
