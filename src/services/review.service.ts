import axiosClient from "../api/axiosClient";
import type { CourseReview, PaginationResponse } from "../types/course";

interface ApiReview {
  id?: number;
  rating?: number | string;
  comment?: string;
  instructorReply?: string;
  instructor_reply?: string;
  instructorRepliedAt?: string;
  instructor_replied_at?: string;
  createdAt?: string;
  created_at?: string;
  user?: {
    id?: number;
    email?: string;
    fullName?: string;
    full_name?: string;
    avatar?: string;
    profile?: {
      fullName?: string;
      full_name?: string;
      avatar?: string;
    };
  };
}

interface ApiReviewResponse {
  reviews?: ApiReview[];
  totalReviews?: number;
  averageRating?: number;
  data?: ApiReview[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface SubmitReviewPayload {
  courseId: number;
  rating: number;
  comment?: string;
}

export interface ReplyReviewPayload {
  replyComment: string;
}

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeReview(item: ApiReview): CourseReview {
  const normalizedFullName =
    item.user?.fullName ??
    item.user?.full_name ??
    item.user?.profile?.fullName ??
    item.user?.profile?.full_name ??
    "Anonymous";

  const normalizedAvatar =
    item.user?.avatar ??
    item.user?.profile?.avatar ??
    "https://placehold.co/40x40";

  return {
    id: toNumber(item.id),
    rating: toNumber(item.rating),
    comment: item.comment ?? "",
    instructorReply: item.instructorReply ?? item.instructor_reply,
    instructorRepliedAt:
      item.instructorRepliedAt ?? item.instructor_replied_at ?? undefined,
    createdAt: item.createdAt ?? item.created_at ?? "",
    user: {
      id: toNumber(item.user?.id),
      email: item.user?.email ?? "",
      profile: {
        fullName: normalizedFullName,
        avatar: normalizedAvatar,
      },
    },
  };
}

const reviewService = {
  /**
   * Lấy danh sách reviews của một khóa học
   * GET /api/reviews/course/:courseId
   */
  getCourseReviews: async (
    courseId: string | number,
  ): Promise<PaginationResponse<CourseReview>> => {
    return axiosClient
      .get<ApiReviewResponse, ApiReviewResponse>(`/reviews/course/${courseId}`)
      .then((response) => {
        const reviewItems = response.reviews ?? response.data ?? [];
        const totalReviews =
          response.totalReviews ?? response.total ?? reviewItems.length;

        return {
          data: reviewItems.map(normalizeReview),
          total: toNumber(totalReviews),
          page: toNumber(response.page) || 1,
          limit: toNumber(response.limit) || 10,
        };
      });
  },

  submitReview: async (payload: SubmitReviewPayload): Promise<void> => {
    await axiosClient.post("/reviews", payload);
  },

  replyToReviewAsInstructor: async (
    reviewId: number,
    payload: ReplyReviewPayload,
  ): Promise<void> => {
    await axiosClient.patch(`/instructor/reviews/${reviewId}/reply`, payload);
  },
};

export default reviewService;
