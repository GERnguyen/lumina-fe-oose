import axiosClient from "../api/axiosClient";

export type AdminUserRole = "student" | "instructor";

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  fullName: string;
  avatar: string;
  createdAt: string;
}

export interface AdminPendingCourse {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  createdAt: string;
  isActive: boolean;
  publishedAt?: string;
  instructorName: string;
  instructorEmail: string;
}

interface ApiAdminUser {
  id?: number;
  email?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  created_at?: string;
  profile?: {
    fullName?: string;
    full_name?: string;
    avatar?: string;
  };
}

interface ApiAdminCourse {
  id?: number;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  createdAt?: string;
  created_at?: string;
  isActive?: boolean;
  publishedAt?: string;
  published_at?: string;
  instructor?: {
    email?: string;
    profile?: {
      fullName?: string;
      full_name?: string;
    };
  };
}

function toNumber(value: number | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeUser(item: ApiAdminUser): AdminUser {
  return {
    id: toNumber(item.id),
    email: item.email ?? "",
    role: item.role ?? "",
    isActive: Boolean(item.isActive),
    fullName:
      item.profile?.fullName ??
      item.profile?.full_name ??
      item.email ??
      "Unknown",
    avatar: item.profile?.avatar ?? "https://placehold.co/64x64",
    createdAt: item.createdAt ?? item.created_at ?? "",
  };
}

function normalizeCourse(item: ApiAdminCourse): AdminPendingCourse {
  return {
    id: toNumber(item.id),
    title: item.title ?? "Untitled course",
    description: item.description ?? "",
    thumbnailUrl:
      item.thumbnailUrl ?? item.thumbnail_url ?? "https://placehold.co/640x420",
    createdAt: item.createdAt ?? item.created_at ?? "",
    isActive: Boolean(item.isActive),
    publishedAt: item.publishedAt ?? item.published_at,
    instructorName:
      item.instructor?.profile?.fullName ??
      item.instructor?.profile?.full_name ??
      item.instructor?.email ??
      "Unknown instructor",
    instructorEmail: item.instructor?.email ?? "",
  };
}

const adminService = {
  async getUsersByRole(role: AdminUserRole): Promise<AdminUser[]> {
    const response = await axiosClient.get<ApiAdminUser[], ApiAdminUser[]>(
      "/admin/users",
      { params: { role } },
    );

    return response.map(normalizeUser);
  },

  async getPendingCourses(): Promise<AdminPendingCourse[]> {
    const response = await axiosClient.get<ApiAdminCourse[], ApiAdminCourse[]>(
      "/admin/courses/pending",
    );

    return response.map(normalizeCourse);
  },

  async approveCourse(courseId: number): Promise<void> {
    await axiosClient.patch(`/admin/courses/${courseId}/approve`);
  },

  async deletePendingCourse(courseId: number): Promise<void> {
    await axiosClient.delete(`/admin/courses/${courseId}`);
  },
};

export default adminService;
