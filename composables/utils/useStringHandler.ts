export const useStringHandler = () => {
  const strSanitize = (str: string | undefined | null) => {
    return str?.replace(/\s+/g, " ").trim().toLowerCase() || "";
  };

  const strDeepSanitize = (str: string | undefined | null) => {
    return str?.replace(/[^a-zA-Z]/g, "").trim();
  };

  const capitalizeWord = (str: string | undefined | null) => {
    str = strSanitize(str);
    return str?.replace(/^\w/, (c) => c.toUpperCase()) || "";
  };

  const capitalizeWords = (str: string | undefined | null) => {
    str = strSanitize(str);
    return (
      str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || ""
    );
  };

  const capitalizeAll = (str: string | undefined | null) => {
    str = strSanitize(str);
    return str?.toUpperCase() || "";
  };

  return {
    capitalizeWord,
    capitalizeWords,
    capitalizeAll,
    strSanitize,
    strDeepSanitize,
  };
};
