import type { Instructor } from "./user";

export interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  courseCount?: number;
}

export interface CourseLecture {
  id: number;
  title: string;
  contentText?: string;
  videoUrl?: string;
  orderIndex: number;
}

export interface CourseQuiz {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
}

export interface CourseSection {
  id: number;
  title: string;
  orderIndex: number;
  lectures?: CourseLecture[];
  quizzes?: CourseQuiz[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  price: number;
  discount_percent: number;
  average_rating: number;
  review_count: number;
  enrollment_count: number;
  is_active?: boolean;
  published_at?: string;
  instructor: Instructor;
  category: Category;
  sections?: CourseSection[];
}

export interface CourseReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    profile: {
      fullName: string;
      avatar: string;
    };
  };
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseListParams {
  categoryId?: number;
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: "best_seller" | "newest" | "price_asc" | "price_desc" | "top_rated";
  priceType?: "free" | "paid";
}
