export default defineNuxtRouteMiddleware((to) => {
  // If the route doesn't require a permission, allow it
  if (!to.meta.permission) return;

  const user = useSanctumUser<IUser>();

  if (!user.value?.permissions?.[to.meta.permission as any]) {
    return navigateTo("/unauthorized", { replace: true });
  }
});
