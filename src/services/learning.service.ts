import axiosClient from "../api/axiosClient";
import type { Enrollment, LectureDetail, MyLearningCourse } from "../types";

const learningService = {
  async getMyCourses(): Promise<MyLearningCourse[]> {
    return axiosClient.get<MyLearningCourse[], MyLearningCourse[]>(
      "/learning/my-courses",
    );
  },

  async getLectureDetail(id: number): Promise<LectureDetail> {
    return axiosClient.get<LectureDetail, LectureDetail>(
      `/learning/lectures/${id}`,
    );
  },

  async markLectureCompleted(id: number): Promise<Enrollment> {
    return axiosClient.post<Enrollment, Enrollment>(
      `/learning/lectures/${id}/complete`,
      {},
    );
  },
};

export default learningService;
