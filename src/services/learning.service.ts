import axiosClient from "../api/axiosClient";
import env from "../env";
import type {
  Enrollment,
  LectureDetail,
  MyLearningCourse,
  QuizDetail,
  QuizSubmissionPayload,
  QuizSubmissionResult,
} from "../types";

interface ApiLectureDetail {
  id: number;
  title: string;
  contentText?: string;
  content_text?: string;
  videoUrl?: string;
  video_url?: string;
  orderIndex?: number | string;
  order_index?: number | string;
  section: {
    id: number;
    title: string;
    orderIndex?: number | string;
    order_index?: number | string;
  };
}

interface ApiQuizAnswer {
  id: number;
  content: string;
  orderIndex?: number | string;
  order_index?: number | string;
}

interface ApiQuizQuestion {
  id: number;
  content: string;
  orderIndex?: number | string;
  order_index?: number | string;
  answers?: ApiQuizAnswer[];
}

interface ApiQuizDetail {
  id: number;
  title: string;
  description?: string;
  orderIndex?: number | string;
  order_index?: number | string;
  questions?: ApiQuizQuestion[];
}

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getAssetBaseUrl(): string {
  return env.apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

function resolveImageUrl(value?: string | null): string {
  if (!value) {
    return "https://placehold.co/600x400";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getAssetBaseUrl()}${normalizedPath}`;
}

function normalizeMyCourse(item: MyLearningCourse): MyLearningCourse {
  return {
    ...item,
    image: resolveImageUrl(item.image),
    progressPercentage: Number(item.progressPercentage) || 0,
  };
}

function normalizeLectureDetail(item: ApiLectureDetail): LectureDetail {
  return {
    id: Number(item.id),
    title: item.title,
    contentText: item.contentText ?? item.content_text,
    videoUrl: item.videoUrl ?? item.video_url,
    orderIndex: toNumber(item.orderIndex ?? item.order_index),
    section: {
      id: Number(item.section.id),
      title: item.section.title,
      orderIndex: toNumber(item.section.orderIndex ?? item.section.order_index),
    },
  };
}

function normalizeQuizDetail(item: ApiQuizDetail): QuizDetail {
  return {
    id: Number(item.id),
    title: item.title,
    description: item.description,
    orderIndex: toNumber(item.orderIndex ?? item.order_index),
    questions: (item.questions ?? [])
      .map((question) => ({
        id: Number(question.id),
        content: question.content,
        orderIndex: toNumber(question.orderIndex ?? question.order_index),
        answers: (question.answers ?? [])
          .map((answer) => ({
            id: Number(answer.id),
            content: answer.content,
            orderIndex: toNumber(answer.orderIndex ?? answer.order_index),
          }))
          .sort((left, right) => left.orderIndex - right.orderIndex),
      }))
      .sort((left, right) => left.orderIndex - right.orderIndex),
  };
}

const learningService = {
  async getMyCourses(): Promise<MyLearningCourse[]> {
    const response = await axiosClient.get<
      MyLearningCourse[],
      MyLearningCourse[]
    >("/learning/my-courses");

    return response.map(normalizeMyCourse);
  },

  async getLectureDetail(id: number): Promise<LectureDetail> {
    const response = await axiosClient.get<ApiLectureDetail, ApiLectureDetail>(
      `/learning/lectures/${id}`,
    );

    return normalizeLectureDetail(response);
  },

  async markLectureCompleted(id: number): Promise<Enrollment> {
    return axiosClient.post<Enrollment, Enrollment>(
      `/learning/lectures/${id}/complete`,
      {},
    );
  },

  async getQuizDetail(id: number): Promise<QuizDetail> {
    const response = await axiosClient.get<ApiQuizDetail, ApiQuizDetail>(
      `/learning/quizzes/${id}`,
    );

    return normalizeQuizDetail(response);
  },

  async submitQuiz(
    id: number,
    payload: QuizSubmissionPayload,
  ): Promise<QuizSubmissionResult> {
    return axiosClient.post<QuizSubmissionResult, QuizSubmissionResult>(
      `/learning/quizzes/${id}/submit`,
      payload,
    );
  },
};

export default learningService;
