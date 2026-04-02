import { useQuery } from "@tanstack/react-query";
import courseService from "../../services/course.service";

/**
 * Custom hook để lấy danh sách khóa học bán chạy nhất
 */
export function useBestSellers() {
  return useQuery({
    queryKey: ["courses", "best-sellers"],
    queryFn: () => courseService.getBestSellers(),
  });
}
