export const useRoleHandler = () => {
  const { user } = useSanctumAuth<IUser>();

  const hasRole = (role: string) => {
    return user.value?.roles?.some(
      (r: any) => r.title.toLowerCase() === role.toLowerCase()
    );
  };

  return {
    hasRole,
  };
};
