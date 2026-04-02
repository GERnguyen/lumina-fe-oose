import { keepPreviousData, useQuery } from "@tanstack/react-query";
import courseService from "../../services/course.service";
import type { CourseListParams } from "../../types/course";

/**
 * Custom hook để lấy danh sách khóa học với filter, search, phân trang
 * @param params - CourseListParams (categoryId, keyword, page, limit, sortBy, etc.)
 */
export function useCourses(params?: CourseListParams) {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseService.getCourses(params),
    placeholderData: keepPreviousData,
  });
}
