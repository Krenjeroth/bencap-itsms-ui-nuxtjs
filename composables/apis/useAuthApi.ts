export const useAuthApi = () => {
  const { login, logout } = useSanctumAuth();

  const authLoginApi = async (form: ILoginForm) => {
    return await login(form);
  };

  const fetchLoggedInUserApi = async () => {
    return await useSanctumUser();
  };

  const authLogoutApi = async () => {
    return await logout();
  };

  return { authLoginApi, fetchLoggedInUserApi, authLogoutApi };
};
