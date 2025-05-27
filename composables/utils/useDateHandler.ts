export const useDateHandler = () => {
  const dayjs = useDayjs();

  const transformUtcDatetime = (
    utcDate: TDatePickerDate,
    dateFormat: string = "YYYY-MM-DD HH:mm:ss",
    timeZone: string = "Asia/Manila"
  ) => {
    return utcDate ? dayjs.utc(utcDate).tz(timeZone).format(dateFormat) : "N/A";
  };

  const transformDatePickerDate = (
    dateParam: TDatePickerDate,
    dateFormat: string = "YYYY-MM-DD"
  ) => {
    if (dateFormat === "YYYY-MM-DD HH:mm:ss") {
      const currentDate = dayjs().utc();
      return dateParam
        ? dayjs(dateParam)
            .hour(currentDate.hour())
            .minute(currentDate.minute())
            .second(currentDate.second())
            .format(dateFormat)
        : "N/A";
    }
    return dateParam ? dayjs(dateParam).format(dateFormat) : "N/A";
  };

  const transformDbDate = (dateParam: TDatePickerDate) => {
    return dateParam ? dayjs(dateParam).toDate() : "N/A";
  };

  const transformDateDurationHumanize = (dateParam: TDatePickerDate) => {
    return dateParam ? dayjs(dateParam).fromNow() : "N/A";
  };

  const calculateExpiryDate = (
    startDate: TDatePickerDate,
    planValidity: number | undefined,
    dateFormat: string = "YYYY-MM-DD HH:mm:ss"
  ) => {
    return startDate && planValidity
      ? dayjs(startDate)
          .add(planValidity || 0, "month")
          .format(dateFormat)
      : "N/A";
  };

  const checkTodayIsAfterExpiryDate = (expiryDate: TDatePickerDate) => {
    return dayjs().isAfter(dayjs(expiryDate));
  };

  return {
    transformUtcDatetime,
    transformDatePickerDate,
    transformDbDate,
    transformDateDurationHumanize,
    calculateExpiryDate,
    checkTodayIsAfterExpiryDate,
  };
};
