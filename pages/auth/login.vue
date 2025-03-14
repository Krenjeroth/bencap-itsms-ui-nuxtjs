<script setup lang="ts">
useHead({
  title: "Login",
});

definePageMeta({
  middleware: ["sanctum:guest"],
});

const { login: loginAction } = useSanctumAuth();

const formState = ref<ILoginForm>({
  email: undefined,
  password: undefined,
});

const isLoading = ref(false);

const validate = (formState: ILoginForm) => {
  const errors = [];
  if (!formState.email) errors.push({ path: "email", message: "Required" });
  if (!formState.password)
    errors.push({ path: "password", message: "Required" });
  return errors;
};

const onLogin = async () => {
  isLoading.value = true;
  await loginAction(formState.value).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <UContainer
    class="flex justify-center items-center m-auto min-h-[calc(90vh-var(--footer-height))]"
  >
    <UCard class="flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <UAvatar
          img-class="mx-auto h-10 w-auto"
          src="https://nuxt.com/assets/design-kit/icon-green.svg"
          alt="1CHOSFITESSGYM Logo"
          size="xl"
        />
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300"
        >
          Sign in to your account
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <UForm
          :validate="validate"
          :state="formState"
          class="space-y-6"
          @submit.prevent="onLogin"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="formState.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" />
          </UFormGroup>

          <UButton type="submit" :loading="isLoading"> Login </UButton>
        </UForm>
      </div>
    </UCard>
  </UContainer>
</template>
