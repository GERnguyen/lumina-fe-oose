import axiosClient from "../api/axiosClient";
import type { Category } from "../types/course";

interface ApiCategory {
  id: number;
  name?: string;
  description?: string;
  parentId?: number | null;
  parent_id?: number | null;
  courseCount?: number | string;
  course_count?: number | string;
}

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCategory(item: ApiCategory): Category {
  return {
    id: Number(item.id),
    name: item.name ?? "",
    description: item.description ?? "",
    parentId: item.parentId ?? item.parent_id ?? null,
    courseCount: toNumber(item.courseCount ?? item.course_count),
  };
}

const categoryService = {
  /**
   * Lấy danh sách tất cả danh mục
   * GET /api/categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get<ApiCategory[], ApiCategory[]>(
      "/categories",
    );
    return response.map(normalizeCategory);
  },
};

export default categoryService;
