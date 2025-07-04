export const useStringHandler = () => {
  interface CapitalizeOptions {
    exceptions?: string[];
    lowercaseWords?: string[];
  }

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
        ?.replace(/[^a-zA-Z0-9 _]+/g, "") // remove non-alphanumeric except space and underscore
        .trim() // remove leading/trailing spaces
        .replace(/\s+/g, "_") // replace spaces with hyphens
        .toLowerCase() || ""
    );
  };

  const strConvertUnderscoreToSpace = (str: string | undefined | null) => {
    return (
      str
        ?.replace(/[^a-zA-Z0-9 _]+/g, "") // clean string
        .trim()
        .replace(/_/g, " ") // convert _ to space
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

  const strSingular = (str: string | undefined | null) => {
    return str?.replace(/(.)$/, "");
  };

  const capitalizeSentences = (
    str: string | undefined | null,
    options: CapitalizeOptions = {},
    sanitize = true
  ): string | undefined => {
    const sanitized = sanitize ? strSanitize(str) : str;
    const exceptions = options.exceptions || ["e.g.", "i.e.", "etc."];
    const lowercaseWords = options.lowercaseWords || [
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "with",
      "of",
      "to",
      "for",
    ];

    return sanitized?.replace(/(^\w+|[.!?]\s+\w+|,\s+\w+)/g, (match) => {
      const word = match.trim();
      const lowerWord = word.toLowerCase();

      if (
        exceptions.some((abbr) => lowerWord.startsWith(abbr)) ||
        lowercaseWords.includes(lowerWord)
      )
        return match.toLowerCase();

      return (
        match.slice(0, -word.length) +
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    });
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
    strSingular,
    capitalizeSentences,
    strConvertUnderscoreToSpace,
  };
};
