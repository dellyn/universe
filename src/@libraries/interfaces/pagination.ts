
export interface PaginationParams {
    page: number;
    limit: number;
  }
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  }
  
  