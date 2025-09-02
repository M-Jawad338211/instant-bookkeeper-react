// src/hooks/queries.ts

import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  type BrandsResponse,
  type CategoriesResponse,
  type FilterParams,
  getBrands,
  getProduct,
  getProductCategories,
  getProducts,
  type ProductResponse,
  type ProductsParams,
} from "./product.service";
import { useSearchParams } from "react-router";

// ---------------------------
// Products Hook
// ---------------------------
export function useProducts() {
  const [searchParams] = useSearchParams();

  const params: ProductsParams = {
    pageNumber: Number(searchParams.get("pageNumber")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    searchTerm: searchParams.get("searchTerm") || undefined,
    brandId: searchParams.get("brandId") || undefined,
    productCategoryId: searchParams.get("productCategoryId") || undefined,
  };

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}

// ---------------------------
// Brands Hook
// ---------------------------
export function useBrands(
  params: FilterParams = { pageNumber: 1, pageSize: 10 }
) {
  return useInfiniteQuery<
    BrandsResponse,
    Error,
    InfiniteData<BrandsResponse>,
    [string, FilterParams],
    FilterParams
  >({
    queryKey: ["brands", params],
    queryFn: ({ pageParam = params }) => getBrands(pageParam),
    initialPageParam: params,
    getNextPageParam: (lastPage, allPages) => {
      const lastPageNumber = allPages.length;
      const totalPages = Math.ceil(lastPage.totalItems / params.pageSize);

      const hasMore = lastPageNumber < totalPages;

      if (!hasMore) return undefined;

      return {
        ...params,
        pageNumber: lastPageNumber + 1,
      };
    },
  });
}

// ---------------------------
// Categories Hook
// ---------------------------
export function useCategories(
  params: FilterParams = { pageNumber: 1, pageSize: 10 }
) {
  return useInfiniteQuery<
    CategoriesResponse,
    Error,
    InfiniteData<CategoriesResponse>,
    [string, FilterParams],
    FilterParams
  >({
    queryKey: ["categories", params],
    initialPageParam: params,
    queryFn: ({ pageParam = params }) => getProductCategories(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const lastPageNumber = allPages.length;
      const totalPages = Math.ceil(lastPage.totalItems / params.pageSize);

      const hasMore = lastPageNumber < totalPages;

      if (!hasMore) return undefined;

      return {
        ...params,
        pageNumber: lastPageNumber + 1,
      };
    },
  });
}

export function useProduct(productId: number) {
  return useQuery<ProductResponse>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: !!productId,
  });
}
