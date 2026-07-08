export type OffsetPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CursorPagination = {
  pageSize: number;
  nextCursor: string | null;
  hasNextPage: boolean;
};
