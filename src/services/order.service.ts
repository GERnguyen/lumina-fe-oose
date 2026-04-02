import axiosClient from "../api/axiosClient";
import env from "../env";
import type { Course } from "../types/course";
import type { Order, OrderDetail, OrderStatus } from "../types/order";
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

interface ApiOrderDetail {
  id?: number;
  courseId?: number;
  course_id?: number;
  unitPrice?: number | string;
  unit_price?: number | string;
  discountAmount?: number | string;
  discount_amount?: number | string;
  finalPrice?: number | string;
  final_price?: number | string;
  course?: ApiCourse;
}

interface ApiOrder {
  id?: number;
  status?: string;
  totalAmount?: number | string;
  total_amount?: number | string;
  discountAmount?: number | string;
  discount_amount?: number | string;
  finalPrice?: number | string;
  final_price?: number | string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  paymentMethod?: string;
  payment_method?: string;
  paidAt?: string;
  paid_at?: string;
  details?: ApiOrderDetail[];
  order_details?: ApiOrderDetail[];
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

function normalizeCategory(item?: ApiCategory) {
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

function normalizeOrderDetail(item: ApiOrderDetail): OrderDetail {
  return {
    id: toNumber(item.id),
    courseId: toNumber(item.courseId ?? item.course_id),
    unit_price: toNumber(item.unitPrice ?? item.unit_price),
    discount_amount: toNumber(item.discountAmount ?? item.discount_amount),
    final_price: toNumber(item.finalPrice ?? item.final_price),
    course: normalizeCourse(item.course),
  };
}

function normalizeOrder(item: ApiOrder): Order {
  const normalizedStatus = (item.status ?? "").toLowerCase();
  const totalAmount = toNumber(item.totalAmount ?? item.total_amount);
  const discountAmount = toNumber(item.discountAmount ?? item.discount_amount);
  const finalPrice =
    toNumber(item.finalPrice ?? item.final_price) || totalAmount;

  let status: OrderStatus = "CANCELLED";
  if (normalizedStatus === "pending") {
    status = "PENDING";
  } else if (normalizedStatus === "paid" || normalizedStatus === "completed") {
    status = "PAID";
  }

  return {
    id: toNumber(item.id),
    status,
    total_amount: totalAmount,
    discount_amount: discountAmount,
    final_price: finalPrice,
    created_at: item.createdAt ?? item.created_at ?? "",
    updated_at: item.updatedAt ?? item.updated_at ?? "",
    payment_method: item.paymentMethod ?? item.payment_method ?? "",
    paid_at: item.paidAt ?? item.paid_at ?? "",
    order_details: (item.order_details ?? item.details ?? []).map(
      normalizeOrderDetail,
    ),
  };
}

const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const response = await axiosClient.get<ApiOrder[], ApiOrder[]>(
      "/orders/my-orders",
    );

    return response.map(normalizeOrder);
  },

  async checkout(data: { useRewardPoints: boolean }): Promise<Order> {
    const response = await axiosClient.post<ApiOrder, ApiOrder>(
      "/orders/checkout",
      data,
    );

    return normalizeOrder(response);
  },

  async confirmPayment(
    orderId: string | number,
    data: { useRewardPoints: boolean },
  ): Promise<Order> {
    const response = await axiosClient.post<ApiOrder, ApiOrder>(
      `/orders/${orderId}/confirm-payment`,
      data,
    );

    return normalizeOrder(response);
  },

  async cancelOrder(orderId: string | number): Promise<Order> {
    const response = await axiosClient.post<ApiOrder, ApiOrder>(
      `/orders/${orderId}/cancel`,
    );

    return normalizeOrder(response);
  },
};

export default orderService;
