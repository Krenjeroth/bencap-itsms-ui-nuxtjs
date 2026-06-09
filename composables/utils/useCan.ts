export const useCan = () => {
  const user = useSanctumUser<IUser>();

  const can = (permission: string): boolean => {
    return user.value?.permissions?.[permission] === true;
  };

  const canAny = (...permissions: string[]): boolean => {
    return permissions.some((p) => can(p));
  };

  const canAll = (...permissions: string[]): boolean => {
    return permissions.every((p) => can(p));
  };

  return { can, canAny, canAll };
};
