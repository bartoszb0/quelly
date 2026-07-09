export type Analytics = {
  totalOrders: number;
  cancelledOrders: number;
  collectedOrders: number;
  completionRate: number;
  cancellationRate: number;
  totalShifts: number;
  avgOrdersPerShift: number;
  totalItemsSold: number;
  avgItemsPerOrder: number;
  topSellers: TopSeller[];
};

type TopSeller = {
  name: string;
  quantity: number;
};
