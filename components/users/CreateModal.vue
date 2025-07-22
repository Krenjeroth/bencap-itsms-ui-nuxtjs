<script setup lang="ts">
const userStore = useUserStore();
const { loading, errorBag, hasError, genderOptions } = storeToRefs(userStore);
const roleStore = useRoleStore();
const { roleSelect } = storeToRefs(roleStore);
roleStore.getRoleSelect();
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
          <UInput v-model="formState.designation" />
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
