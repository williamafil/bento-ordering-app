export const badgeColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "inProgress":
      return "bg-purple-100 text-purple-800";
    case "ready":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

export const badgeLabel = (status) => {
  switch (status) {
    case "pending":
      return "待處理";
    case "inProgress":
      return "準備中";
    case "ready":
      return "餐點已備妥";
    case "delivered":
      return "已取餐";
    case "canceled":
      return "取消";
    default:
      return " - ";
  }
};

export const actionLabel = (status) => {
  switch (status) {
    case "PROCEEDING":
      return "開始準備";
    case "CANCELING":
      return "取消訂單";
    case "READY_TO_GO":
      return "餐點準備好了";
    case "DELIVERED":
      return "出餐完畢";
    case "RESET":
      return "狀態重整";
    default:
      return " - ";
  }
};
