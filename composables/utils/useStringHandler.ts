export const useStringHandler = () => {
  const strSanitize = (str: string | undefined | null) => {
    return str?.replace(/\s+/g, " ").trim().toLowerCase() || ""; // Sanitize string, remove extra white space, to lower
  };

  const strDeepSanitize = (str: string | undefined | null) => {
    return str?.replace(/[^a-zA-Z]/g, "").trim();
  };

  const strAlphabetOnly = (str: string | undefined | null) => {
    return str?.replace(/[^a-zA-Z0-9 ]+/g, "").trim(); // remove non-alphanumeric except space
  };

  const strConvertSpaceToUnderscore = (str: string | undefined | null) => {
    return (
      str
        ?.replace(/[^a-zA-Z0-9 ]+/g, "") // remove non-alphanumeric except space
        .trim() // remove leading/trailing spaces
        .replace(/\s+/g, "_") // replace spaces with hyphens
        .toLowerCase() || ""
    );
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

  const lowerCaseAll = (str: string | undefined | null) => {
    return str?.toLowerCase() || "";
  };

  return {
    capitalizeWord,
    capitalizeWords,
    capitalizeAll,
    strSanitize,
    strDeepSanitize,
    strConvertSpaceToUnderscore,
    strAlphabetOnly,
    lowerCaseAll,
  };
};
