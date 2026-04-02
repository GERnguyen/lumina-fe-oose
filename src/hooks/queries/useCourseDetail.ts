import { useQuery } from "@tanstack/react-query";
import courseService from "../../services/course.service";
import reviewService from "../../services/review.service";
import type { Course, CourseReview } from "../../types/course";

export interface CourseDetailData {
  course: Course;
  reviews: CourseReview[];
  reviewsTotal: number;
}

/**
 * Fetch song song course detail + review list để giảm thời gian chờ khi vào trang detail.
 */
export function useCourseDetail(courseId?: string | number) {
  return useQuery<CourseDetailData>({
    queryKey: ["course-detail", courseId],
    queryFn: async (): Promise<CourseDetailData> => {
      const [course, reviewsResponse] = await Promise.all([
        courseService.getCourseDetail(courseId!),
        reviewService.getCourseReviews(courseId!),
      ]);

      return {
        course,
        reviews: reviewsResponse.data,
        reviewsTotal: reviewsResponse.total,
      };
    },
    enabled: !!courseId,
  });
}
