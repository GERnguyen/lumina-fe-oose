import axiosClient from "../api/axiosClient";
import env from "../env";
import type { Cart, CartItem } from "../types/cart";
import type { Category, Course } from "../types/course";
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
}

interface ApiCartItem {
  id?: number;
  courseId?: number;
  course_id?: number;
  unitPrice?: number | string;
  unit_price?: number | string;
  quantity?: number | string;
  course?: ApiCourse;
}

interface ApiCart {
  id?: number;
  user?: { id?: number };
  user_id?: number;
  items?: ApiCartItem[];
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

function normalizeCourse(item?: ApiCourse): Course {
  return {
    id: toNumber(item?.id),
    title: item?.title ?? "Untitled Course",
    slug: item?.slug ?? "",
    description: item?.description ?? "",
    thumbnail_url: resolveThumbnailUrl(
      item?.thumbnail_url ?? item?.thumbnailUrl,
    ),
    price: toNumber(item?.price),
    discount_percent: toNumber(item?.discount_percent ?? item?.discountPercent),
    average_rating: toNumber(item?.average_rating ?? item?.averageRating),
    review_count: toNumber(item?.review_count ?? item?.reviewCount),
    enrollment_count: toNumber(item?.enrollment_count ?? item?.enrollmentCount),
    instructor: normalizeInstructor(item?.instructor),
    category: normalizeCategory(item?.category),
  };
}

function normalizeCartItem(item: ApiCartItem): CartItem {
  return {
    id: toNumber(item.id),
    courseId: toNumber(item.courseId ?? item.course_id ?? item.course?.id),
    unit_price: toNumber(item.unitPrice ?? item.unit_price),
    quantity: toNumber(item.quantity) || 1,
    course: normalizeCourse(item.course),
  };
}

function normalizeCart(item: ApiCart): Cart {
  return {
    id: toNumber(item.id),
    user_id: toNumber(item.user?.id ?? item.user_id),
    items: (item.items ?? []).map(normalizeCartItem),
  };
}

const cartService = {
  async getCart(): Promise<Cart> {
    const response = await axiosClient.get<ApiCart, ApiCart>("/cart");
    return normalizeCart(response);
  },

  async addToCart(courseId: number): Promise<Cart> {
    const response = await axiosClient.post<ApiCart, ApiCart>("/cart", {
      courseId,
    });
    return normalizeCart(response);
  },

  async removeFromCart(courseId: number): Promise<void> {
    await axiosClient.delete(`/cart/${courseId}`);
  },
};

export default cartService;
