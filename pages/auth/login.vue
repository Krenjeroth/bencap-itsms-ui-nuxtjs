<script setup lang="ts">
useHead({
  title: "Login",
});

definePageMeta({
  middleware: ["sanctum:guest"],
});

const authStore = useAuthStore();
const { loading, errorBag, hasError } = storeToRefs(authStore);

const formState = ref<ILoginForm>({
  email: undefined,
  password: undefined,
});

const validate = (formState: ILoginForm) => {
  const errors = [];
  if (!formState.email) errors.push({ path: "email", message: "Required" });
  if (!formState.password)
    errors.push({ path: "password", message: "Required" });
  return errors;
};

const onLogin = async (event: any) => {
  await authStore.authLogin(event.data);

  console.log(errorBag.value);
};
</script>

<template>
  <UContainer
    class="flex justify-center items-center m-auto min-h-[calc(90vh-var(--footer-height))]"
  >
    <UCard class="flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <SvgsLogo
          class="w-16 h-16 lg:w-40 lg:h-40 mx-auto text-blue-800 dark:text-blue-400"
        />
        <h2
          class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300"
        >
          Sign in to your account
        </h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <UForm
          :state="formState"
          :errors="errorBag"
          class="space-y-6"
          :validate="validate"
          @submit.prevent="onLogin"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="formState.email" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput v-model="formState.password" type="password" />
          </UFormGroup>

          <UButton type="submit" :loading="loading"> Login </UButton>

          <!-- !! Fix error display soon -->
          <div v-if="hasError" class="text-red-500 text-sm text-center mt-4">
            {{ errorBag }}
          </div>
        </UForm>
      </div>
    </UCard>
  </UContainer>
</template>
