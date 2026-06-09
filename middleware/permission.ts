export default defineNuxtRouteMiddleware((to) => {
  if (!to.meta.permission) return;

  const user = useSanctumUser<IUser>();
  const permission = to.meta.permission as string;

  if (user.value?.permissions?.[permission] !== true) {
    return navigateTo("/unauthorized", { replace: true });
  }
});
