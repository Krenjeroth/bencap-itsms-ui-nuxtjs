<script setup lang="ts">
import { cloneDeep } from "lodash";
const userStore = useUserStore();
const { loading, errorBag, hasError } = storeToRefs(userStore);
const roleStore = useRoleStore();
const { roleSelect } = storeToRefs(roleStore);
roleStore.getRoleSelect();
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

const formState = ref<IUpdateUserForm>({
  name: props.user?.name ?? undefined,
  email: props.user?.email ?? undefined,
  role: props.user?.roles[0].id ?? undefined,
});

const originalState = ref<IUpdateUserForm>(
  cloneDeep({
    name: props.user?.name ?? undefined,
    email: props.user?.email ?? undefined,
    role: props.user?.roles[0].id ?? undefined,
  })
);

const fieldsToCompare: (keyof IUpdateUserForm)[] = ["name", "email", "role"];

const isChangedComputed = computed(() => {
  return fieldsToCompare.some((key) => {
    const a = formState.value[key];
    const b = originalState.value[key];

    return !isEqual(a, b);
  });
});

const handleSubmit = async (
  event: IFormSubmitEvent<TUpdateUserValidationSchema>
) => {
  if (!isChangedComputed.value) {
    onNoDataChange();
    return;
  }

  await userStore.updateUser(props.user?.id, event.data);

  if (hasError.value) {
    onError();
    return;
  }

  onSuccess();
  return;
};
</script>

<template>
  <BaseModal :on-close="onClose" :title="'Edit User'">
    <UForm
      :schema="UpdateUserValidationSchema"
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

      <UFormGroup label="Role" name="role" :error="errorBag.role">
        <USelect
          v-model="formState.role"
          :options="roleSelect"
          value-attribute="id"
          option-attribute="title"
          placeholder="Select"
        />
      </UFormGroup>

      <UButton type="submit" :loading="loading" :disabled="!isChangedComputed">
        Update
      </UButton>
    </UForm>
  </BaseModal>
</template>
