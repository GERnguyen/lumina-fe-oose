import axiosClient from "../api/axiosClient";
import type { Course, CourseListParams, PaginatedResponse } from "../types";

const courseService = {
  async getAllCourses(
    params?: CourseListParams,
  ): Promise<PaginatedResponse<Course>> {
    return axiosClient.get<
      PaginatedResponse<Course>,
      PaginatedResponse<Course>
    >("/courses", {
      params,
    });
  },

  async getCourseById(id: number): Promise<Course> {
    return axiosClient.get<Course, Course>(`/courses/${id}`);
  },

  async getBestSellers(): Promise<Course[]> {
    return axiosClient.get<Course[], Course[]>("/courses/best-sellers");
  },
};

export default courseService;
