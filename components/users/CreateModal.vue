<script setup lang="ts">
const userStore = useUserStore();
const { loading, errorBag, hasError } = storeToRefs(userStore);
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
  name: undefined,
  email: undefined,
  password: undefined,
});

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
  <BaseModal :on-close="onClose" :title="'Create User'">
    <UForm
      :schema="CreateUserValidationSchema"
      :state="formState"
      @submit.prevent="handleSubmit"
      class="space-y-6"
    >
      <UFormGroup label="Name" name="name" :error="errorBag.name">
        <UInput v-model="formState.name" />
      </UFormGroup>

      <UFormGroup label="Email" name="email" :error="errorBag.email">
        <UInput v-model="formState.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password" :error="errorBag.password">
        <UInput v-model="formState.password" type="password" />
      </UFormGroup>

      <UButton type="submit" :loading="loading"> Add </UButton>
    </UForm>
  </BaseModal>
</template>
