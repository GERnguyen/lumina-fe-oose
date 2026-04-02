import { useQuery } from "@tanstack/react-query";
import reviewService from "../../services/review.service";

/**
 * Custom hook để lấy reviews của một khóa học
 * @param courseId - ID của khóa học
 */
export function useCourseReviews(courseId?: string | number) {
  return useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => reviewService.getCourseReviews(courseId!),
    enabled: !!courseId, // Chỉ fetch khi courseId được cung cấp
  });
}
