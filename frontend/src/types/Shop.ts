import type { ActiveShift } from "./Shift";

export type Shop = {
  createdAt: string;
  id: string;
  name: string;
  ownerId: string;
  publicId: string;
  updatedAt: string;
};

export type ShopDetail = Shop & {
  activeShift: ActiveShift | null;
};
