export const useColorHandler = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "queued":
        return "yellow";
      case "checking_stock":
        return "yellow";
      case "awaiting_stock":
        return "yellow";
      case "in_progress":
        return "blue";
      case "resolved":
        return "green";
      // case "awaiting_user":
      //   return "yellow";
      // case "awaiting_vendor":
      //   return "yellow";
      case "reopened":
        return "purple";
      case "pending":
        return "yellow";
      case "closed":
        return "green";
      case "cancelled":
        return "red";
      case "low":
        return "blue";
      case "medium":
        return "yellow";
      case "high":
        return "red";
      default:
        return "gray";
    }
  };

  return {
    getStatusColor,
  };
};
