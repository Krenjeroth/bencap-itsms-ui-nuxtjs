export const useAuthApi = () => {
  const { login } = useSanctumAuth();

  const authLoginApi = async (form: ILoginForm) => {
    return await login(form);
  };

  const fetchLoggedInUserApi = async () => {
    return await useSanctumUser();
  };

  return { authLoginApi, fetchLoggedInUserApi };
};
