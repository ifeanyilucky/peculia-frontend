export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
}

export interface PaginatedData<T> {
  results: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
