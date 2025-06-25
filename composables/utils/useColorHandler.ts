export const useColorHandler = () => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      // Query Status
      case "queued":
        return "yellow";
      case "checking_stock":
        return "yellow";
      case "awaiting_part":
        return "yellow";
      case "awaiting_user":
        return "yellow";
      case "awaiting_vendor":
        return "yellow";
      case "in_progress":
        return "blue";
      case "cancelled":
        return "red";
      case "resolved":
        return "green";
      case "reopened":
        return "purple";
      // Request Status
      case "open":
        return "yellow";
      case "accepted":
        return "blue";
      case "closed":
        return "gray";
      // Priority
      case "low":
        return "blue";
      case "medium":
        return "yellow";
      case "high":
        return "red";
      // Completion Type
      case "on_site":
        return "blue";
      case "pulled_out":
        return "yellow";
      default:
        return "gray";
    }
  };

  return {
    getStatusColor,
  };
};
