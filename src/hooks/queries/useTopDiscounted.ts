import { useQuery } from "@tanstack/react-query";
import courseService from "../../services/course.service";

/**
 * Custom hook để lấy danh sách khóa học có giảm giá cao nhất
 */
export function useTopDiscounted() {
  return useQuery({
    queryKey: ["courses", "top-discounted"],
    queryFn: () => courseService.getTopDiscounted(),
  });
}
