export const useToastHandler = () => {
  const toast = useToast();

  const actionToastResult = (toastSettings: object) => toast.add(toastSettings);

  return {
    toast,
    actionToastResult,
  };
};
