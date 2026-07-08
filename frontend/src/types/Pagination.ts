export type OffsetPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CursorPagination = {
  pageSize: number;
  total: number;
  nextCursor: string | null;
  hasNextPage: boolean;
};
