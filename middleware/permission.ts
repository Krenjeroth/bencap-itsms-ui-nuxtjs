export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSanctumUser<IUser>();

  // If user does not have the required permission, they will be redirected to unauthorized page
  if (!user.value?.permissions?.[to.meta.permission as any]) {
    return navigateTo("/unauthorized", { replace: true });
  }
});
