import { useQuery } from "@tanstack/react-query";
import categoryService from "../../services/category.service";

/**
 * Custom hook để lấy danh sách danh mục
 * Sử dụng React Query để caching và refetch
 */
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });
}
