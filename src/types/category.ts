export interface CategoryItem {
  _id: string;
  name: string;
  parent: string | null | Record<string, unknown>;
  isActive?: boolean;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryMeta {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface CategoryApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    categories: CategoryItem[];
    meta?: CategoryMeta;
    totalCategories?: number;
  };
}
