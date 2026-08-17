export default defineNuxtRouteMiddleware((to) => {
  const requiredPermission = to.meta.permission as string | undefined;

  if (!requiredPermission) {
    return;
  }

  const user = useSanctumUser<IUser>();

  if (!user.value) {
    return navigateTo("/login", { replace: true });
  }

  const hasPermission = user.value.permissions?.[requiredPermission] === true;

  if (!hasPermission) {
    return navigateTo("/unauthorized", { replace: true });
  }
});
