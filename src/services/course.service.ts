import axiosClient from "../api/axiosClient";
import env from "../env";
import type {
  Category,
  Course,
  CourseLecture,
  CourseListParams,
  CourseSection,
  CourseQuiz,
  PaginationResponse,
} from "../types/course";
import type { Instructor, Profile } from "../types/user";

interface ApiProfile {
  id?: number;
  fullName?: string;
  full_name?: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
  phone_number?: string;
}

interface ApiInstructor {
  id?: number;
  email?: string;
  role?: string;
  profile?: ApiProfile;
}

interface ApiCategory {
  id?: number;
  name?: string;
  description?: string;
  parentId?: number | null;
  parent_id?: number | null;
}

interface ApiLecture {
  id?: number;
  title?: string;
  contentText?: string;
  content_text?: string;
  videoUrl?: string;
  video_url?: string;
  orderIndex?: number | string;
  order_index?: number | string;
}

interface ApiQuiz {
  id?: number;
  title?: string;
  description?: string;
  orderIndex?: number | string;
  order_index?: number | string;
}

interface ApiSection {
  id?: number;
  title?: string;
  orderIndex?: number | string;
  order_index?: number | string;
  lectures?: ApiLecture[];
  quizzes?: ApiQuiz[];
}

interface ApiCourse {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  thumbnail_url?: string;
  thumbnailUrl?: string;
  price?: number | string;
  discount_percent?: number | string;
  discountPercent?: number | string;
  average_rating?: number | string;
  averageRating?: number | string;
  review_count?: number | string;
  reviewCount?: number | string;
  enrollment_count?: number | string;
  enrollmentCount?: number | string;
  instructor?: ApiInstructor;
  category?: ApiCategory;
  sections?: ApiSection[];
}

interface ApiPaginatedCourseResponse {
  data?: ApiCourse[];
  total?: number;
  page?: number;
  limit?: number;
}

function getAssetBaseUrl(): string {
  return env.apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

function resolveThumbnailUrl(value?: string): string {
  if (!value) {
    return "https://placehold.co/600x400";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getAssetBaseUrl()}${normalizedPath}`;
}

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeProfile(item?: ApiProfile): Profile {
  return {
    id: toNumber(item?.id),
    fullName: item?.fullName ?? item?.full_name ?? "Unknown instructor",
    avatar: item?.avatar ?? "https://placehold.co/64x64",
    bio: item?.bio ?? "",
    phoneNumber: item?.phoneNumber ?? item?.phone_number ?? "",
  };
}

function normalizeInstructor(item?: ApiInstructor): Instructor {
  return {
    id: toNumber(item?.id),
    email: item?.email ?? "",
    role: item?.role ?? "instructor",
    profile: normalizeProfile(item?.profile),
  };
}

function normalizeCategory(item?: ApiCategory): Category {
  return {
    id: toNumber(item?.id),
    name: item?.name ?? "Uncategorized",
    description: item?.description ?? "",
    parentId: item?.parentId ?? item?.parent_id ?? null,
  };
}

function normalizeLecture(item: ApiLecture): CourseLecture {
  return {
    id: toNumber(item.id),
    title: item.title ?? "Untitled lecture",
    contentText: item.contentText ?? item.content_text ?? "",
    videoUrl: item.videoUrl ?? item.video_url ?? "",
    orderIndex: toNumber(item.orderIndex ?? item.order_index) || 1,
  };
}

function normalizeQuiz(item: ApiQuiz): CourseQuiz {
  return {
    id: toNumber(item.id),
    title: item.title ?? "Untitled quiz",
    description: item.description ?? "",
    orderIndex: toNumber(item.orderIndex ?? item.order_index) || 1,
  };
}

function normalizeSection(item: ApiSection): CourseSection {
  return {
    id: toNumber(item.id),
    title: item.title ?? "Untitled section",
    orderIndex: toNumber(item.orderIndex ?? item.order_index) || 1,
    lectures: (item.lectures ?? [])
      .map(normalizeLecture)
      .sort((left, right) => left.orderIndex - right.orderIndex),
    quizzes: (item.quizzes ?? [])
      .map(normalizeQuiz)
      .sort((left, right) => left.orderIndex - right.orderIndex),
  };
}

function normalizeCourse(item: ApiCourse): Course {
  return {
    id: toNumber(item.id),
    title: item.title ?? "Untitled Course",
    slug: item.slug ?? "",
    description: item.description ?? "",
    thumbnail_url: resolveThumbnailUrl(item.thumbnail_url ?? item.thumbnailUrl),
    price: toNumber(item.price),
    discount_percent: toNumber(item.discount_percent ?? item.discountPercent),
    average_rating: toNumber(item.average_rating ?? item.averageRating),
    review_count: toNumber(item.review_count ?? item.reviewCount),
    enrollment_count: toNumber(item.enrollment_count ?? item.enrollmentCount),
    instructor: normalizeInstructor(item.instructor),
    category: normalizeCategory(item.category),
    sections: (item.sections ?? [])
      .map(normalizeSection)
      .sort((left, right) => left.orderIndex - right.orderIndex),
  };
}

function normalizePaginatedCourses(
  response: ApiPaginatedCourseResponse,
  fallbackLimit: number,
): PaginationResponse<Course> {
  return {
    data: (response.data ?? []).map(normalizeCourse),
    total: toNumber(response.total),
    page: toNumber(response.page) || 1,
    limit: toNumber(response.limit) || fallbackLimit,
  };
}

const courseService = {
  async getCourses(
    params: CourseListParams = {},
  ): Promise<PaginationResponse<Course>> {
    const queryParams: CourseListParams = {
      categoryId: params.categoryId,
      keyword: params.keyword,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      priceType: params.priceType,
    };

    const response = await axiosClient.get<
      ApiPaginatedCourseResponse,
      ApiPaginatedCourseResponse
    >("/courses", {
      params: queryParams,
    });

    return normalizePaginatedCourses(response, params.limit ?? 12);
  },

  async getCourseDetail(id: number | string): Promise<Course> {
    const response = await axiosClient.get<ApiCourse, ApiCourse>(
      `/courses/${id}`,
    );
    return normalizeCourse(response);
  },

  async getBestSellers(): Promise<Course[]> {
    const response = await axiosClient.get<ApiCourse[], ApiCourse[]>(
      "/courses/best-sellers",
    );
    return response.map(normalizeCourse);
  },

  async getTopDiscounted(): Promise<Course[]> {
    const response = await axiosClient.get<ApiCourse[], ApiCourse[]>(
      "/courses/top-discounted",
    );
    return response.map(normalizeCourse);
  },
};

export default courseService;
