export const useAuthApi = () => {
  const { login } = useSanctumAuth();

  const authLoginApi = async (form: ILoginForm) => {
    return await login(form);
  };

  return { authLoginApi };
};
