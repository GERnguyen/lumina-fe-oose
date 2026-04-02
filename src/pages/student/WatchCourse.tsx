import {
  BookOpenCheck,
  Brain,
  ChevronRight,
  FileText,
  HelpCircle,
  PartyPopper,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LearningCurriculum, {
  type LearningContentType,
  type LearningCurriculumItem,
  type LearningCurriculumSection,
} from "../../components/LearningCurriculum";
import Alert, { type AlertVariant } from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import {
  useCourseDetail,
  useLectureDetail,
  useMyLearningCourses,
  useQuizDetail,
} from "../../hooks/queries";
import learningService from "../../services/learning.service";
import { cn } from "../../utils/cn";
import type { CourseSection } from "../../types/course";
import type { Enrollment, MyLearningCourse } from "../../types";

interface ToastState {
  variant: AlertVariant;
  message: string;
}

interface EnrollmentProgressState {
  enrollmentId: number;
  progressPercent: number;
  enrolledAt: string;
  completedAt?: string;
}

interface QuizResultModalState {
  quizId: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  isPassed: boolean;
  nextItem?: LearningCurriculumItem;
}

interface CourseCompletionModalState {
  isOpen: boolean;
}

function toNumber(value?: string | number | null): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response
  ) {
    const message = (error.response as { data?: { message?: unknown } }).data
      ?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function normalizeSectionToCurriculum(
  section: CourseSection,
  completedLectureIds: number[],
  completedQuizIds: number[],
): LearningCurriculumSection {
  const lectureItems: LearningCurriculumItem[] = (section.lectures ?? []).map(
    (lecture) => ({
      id: lecture.id,
      type: "lecture",
      title: lecture.title,
      orderIndex: lecture.orderIndex,
      completed: completedLectureIds.includes(lecture.id),
    }),
  );

  const quizItems: LearningCurriculumItem[] = (section.quizzes ?? []).map(
    (quiz) => ({
      id: quiz.id,
      type: "quiz",
      title: quiz.title,
      orderIndex: quiz.orderIndex,
      completed: completedQuizIds.includes(quiz.id),
    }),
  );

  return {
    id: section.id,
    title: section.title,
    lectureCount: lectureItems.length,
    quizCount: quizItems.length,
    items: [...lectureItems, ...quizItems].sort((left, right) => {
      if (left.orderIndex !== right.orderIndex) {
        return left.orderIndex - right.orderIndex;
      }

      if (left.type === right.type) {
        return 0;
      }

      return left.type === "lecture" ? -1 : 1;
    }),
  };
}

function WorkspaceSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="h-9 w-2/5 animate-pulse rounded bg-gray-100" />
      <div className="h-5 w-full animate-pulse rounded bg-gray-100" />
      <div className="h-5 w-11/12 animate-pulse rounded bg-gray-100" />
      <div className="h-5 w-10/12 animate-pulse rounded bg-gray-100" />
      <div className="h-5 w-9/12 animate-pulse rounded bg-gray-100" />
      <div className="pt-2">
        <div className="h-12 w-48 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

export default function WatchCourse() {
  const queryClient = useQueryClient();
  const { courseId } = useParams<{ courseId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [completedLectureIds, setCompletedLectureIds] = useState<number[]>([]);
  const [completedQuizIds, setCompletedQuizIds] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [quizResultModal, setQuizResultModal] =
    useState<QuizResultModalState | null>(null);
  const [courseCompletionModal, setCourseCompletionModal] =
    useState<CourseCompletionModalState>({ isOpen: false });
  const [enrollmentProgress, setEnrollmentProgress] =
    useState<EnrollmentProgressState | null>(null);

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourseDetail(courseId);
  const { data: myLearningCourses = [] } = useMyLearningCourses();

  const course = courseData?.course;
  const numericCourseId = toNumber(courseId);

  const courseSections: CourseSection[] = course?.sections ?? [];

  const serverProgressPercent = useMemo(
    () =>
      enrollmentProgress?.progressPercent ??
      toNumber(
        myLearningCourses.find((item) => item.courseId === numericCourseId)
          ?.progressPercentage,
      ),
    [enrollmentProgress?.progressPercent, myLearningCourses, numericCourseId],
  );

  const totalCurriculumItems = useMemo(
    () =>
      courseSections.reduce(
        (total, section) =>
          total +
          (section.lectures?.length ?? 0) +
          (section.quizzes?.length ?? 0),
        0,
      ),
    [courseSections],
  );

  useEffect(() => {
    if (
      totalCurriculumItems === 0 ||
      completedLectureIds.length > 0 ||
      completedQuizIds.length > 0 ||
      serverProgressPercent <= 0
    ) {
      return;
    }

    const targetCompletedCount = Math.min(
      totalCurriculumItems,
      Math.floor((serverProgressPercent / 100) * totalCurriculumItems),
    );

    if (targetCompletedCount <= 0) {
      return;
    }

    const orderedBySection = courseSections
      .flatMap((section) => {
        const lectures = (section.lectures ?? []).map((lecture) => ({
          id: lecture.id,
          type: "lecture" as const,
          orderIndex: lecture.orderIndex,
        }));

        const quizzes = (section.quizzes ?? []).map((quiz) => ({
          id: quiz.id,
          type: "quiz" as const,
          orderIndex: quiz.orderIndex,
        }));

        return [...lectures, ...quizzes].sort((left, right) => {
          if (left.orderIndex !== right.orderIndex) {
            return left.orderIndex - right.orderIndex;
          }

          if (left.type === right.type) {
            return 0;
          }

          return left.type === "lecture" ? -1 : 1;
        });
      })
      .slice(0, targetCompletedCount);

    setCompletedLectureIds(
      orderedBySection
        .filter((item) => item.type === "lecture")
        .map((item) => item.id),
    );

    setCompletedQuizIds(
      orderedBySection
        .filter((item) => item.type === "quiz")
        .map((item) => item.id),
    );
  }, [
    completedLectureIds.length,
    completedQuizIds.length,
    courseSections,
    serverProgressPercent,
    totalCurriculumItems,
  ]);

  const curriculumSections = useMemo(() => {
    const baseSections = courseSections.map((section) =>
      normalizeSectionToCurriculum(
        section,
        completedLectureIds,
        completedQuizIds,
      ),
    );

    return baseSections.map((section, index) => {
      const completedItemCount = section.items.filter(
        (item) => item.completed,
      ).length;
      const totalItemCount = section.items.length;
      const isCompleted =
        totalItemCount > 0 && completedItemCount === totalItemCount;

      const previousSection = baseSections[index - 1];
      const previousCompleted =
        !previousSection ||
        (previousSection.items.length > 0 &&
          previousSection.items.every((item) => item.completed));

      return {
        ...section,
        progressText:
          totalItemCount > 0
            ? `${completedItemCount}/${totalItemCount} completed`
            : undefined,
        locked: index > 0 && !previousCompleted,
        items: section.items,
        isCompleted,
      };
    });
  }, [completedLectureIds, completedQuizIds, courseSections]);

  const firstItem = useMemo(() => {
    for (const section of curriculumSections) {
      if (section.items.length > 0) {
        return section.items[0];
      }
    }

    return undefined;
  }, [curriculumSections]);

  const selectedType = searchParams.get("type");
  const selectedId = toNumber(searchParams.get("id"));

  const orderedItems = useMemo(
    () => curriculumSections.flatMap((section) => section.items),
    [curriculumSections],
  );

  const localProgressPercent = useMemo(() => {
    if (orderedItems.length === 0) {
      return 0;
    }

    const completedCount = orderedItems.filter((item) => item.completed).length;
    return Math.round((completedCount / orderedItems.length) * 100);
  }, [orderedItems]);

  const progressPercent = Math.max(serverProgressPercent, localProgressPercent);

  const selectedItem = useMemo(() => {
    if (
      (selectedType !== "lecture" && selectedType !== "quiz") ||
      !selectedId
    ) {
      return undefined;
    }

    for (const section of curriculumSections) {
      const item = section.items.find(
        (current: LearningCurriculumItem) =>
          current.type === selectedType && current.id === selectedId,
      );

      if (item) {
        return item;
      }
    }

    return undefined;
  }, [curriculumSections, selectedId, selectedType]);

  const goToNextItem = (current?: LearningCurriculumItem) => {
    if (!current) {
      return;
    }

    const currentIndex = orderedItems.findIndex(
      (item) => item.type === current.type && item.id === current.id,
    );

    if (currentIndex < 0) {
      return;
    }

    const nextItem = orderedItems[currentIndex + 1];
    if (!nextItem) {
      return;
    }

    setSearchParams(
      {
        type: nextItem.type,
        id: String(nextItem.id),
      },
      { replace: false },
    );
  };

  const getNextItem = (current?: LearningCurriculumItem) => {
    if (!current) {
      return undefined;
    }

    const currentIndex = orderedItems.findIndex(
      (item) => item.type === current.type && item.id === current.id,
    );

    if (currentIndex < 0) {
      return undefined;
    }

    return orderedItems[currentIndex + 1];
  };

  useEffect(() => {
    if (selectedItem || !firstItem) {
      return;
    }

    setSearchParams(
      {
        type: firstItem.type,
        id: String(firstItem.id),
      },
      { replace: true },
    );
  }, [firstItem, selectedItem, setSearchParams]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 2600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  useEffect(() => {
    setSelectedAnswers({});
  }, [selectedItem?.id, selectedItem?.type]);

  useEffect(() => {
    if (progressPercent >= 100) {
      setCourseCompletionModal({ isOpen: true });
    }
  }, [progressPercent]);

  const lectureId =
    selectedItem?.type === "lecture" ? selectedItem.id : undefined;
  const quizId = selectedItem?.type === "quiz" ? selectedItem.id : undefined;

  const lectureQuery = useLectureDetail(lectureId);
  const quizQuery = useQuizDetail(quizId);

  const syncEnrollmentProgress = (enrollment: Enrollment) => {
    const normalizedProgress = toNumber(enrollment.progressPercent);

    setEnrollmentProgress({
      enrollmentId: enrollment.id,
      progressPercent: normalizedProgress,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
    });

    queryClient.setQueryData<MyLearningCourse[]>(
      ["learning", "my-courses"],
      (current) => {
        if (!current) {
          return current;
        }

        return current.map((item) =>
          item.courseId === numericCourseId
            ? { ...item, progressPercentage: normalizedProgress }
            : item,
        );
      },
    );

    void queryClient.invalidateQueries({
      queryKey: ["learning", "my-courses"],
    });
  };

  const markLectureCompletedMutation = useMutation({
    mutationFn: (id: number) => learningService.markLectureCompleted(id),
    onSuccess: (enrollment, lectureIdValue) => {
      setCompletedLectureIds((current) =>
        current.includes(lectureIdValue)
          ? current
          : [...current, lectureIdValue],
      );
      syncEnrollmentProgress(enrollment);
      setToast({
        variant: "success",
        message: "Lecture marked as complete.",
      });
      goToNextItem({
        id: lectureIdValue,
        type: "lecture",
        title: "",
        orderIndex: 0,
      });
    },
    onError: (error) => {
      setToast({
        variant: "error",
        message: extractErrorMessage(
          error,
          "Unable to mark lecture as complete.",
        ),
      });
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: (payload: { quizId: number; selectedAnswerIds: number[] }) =>
      learningService.submitQuiz(payload.quizId, {
        selectedAnswerIds: payload.selectedAnswerIds,
      }),
    onSuccess: (result, variables) => {
      const isPassed = result.score >= 100;

      if (isPassed) {
        setCompletedQuizIds((current) =>
          current.includes(variables.quizId)
            ? current
            : [...current, variables.quizId],
        );
      }

      const nextItem = getNextItem(selectedItem);
      setToast({
        variant: isPassed ? "success" : "warning",
        message: isPassed
          ? "Quiz completed successfully."
          : "Quiz is not passed yet. You need 100% to pass.",
      });

      setQuizResultModal({
        quizId: variables.quizId,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        isPassed,
        nextItem,
      });
    },
    onError: (error) => {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Quiz submission failed."),
      });
    },
  });

  const handleSelectItem = (item: LearningCurriculumItem) => {
    const sectionOfItem = curriculumSections.find((section) =>
      section.items.some(
        (current) => current.type === item.type && current.id === item.id,
      ),
    );

    if (sectionOfItem?.locked) {
      setToast({
        variant: "warning",
        message: "Hay hoan thanh section truoc de mo khoa section nay.",
      });
      return;
    }

    setSearchParams(
      {
        type: item.type,
        id: String(item.id),
      },
      { replace: false },
    );
  };

  const handleSubmitQuiz = () => {
    if (!quizId) {
      return;
    }

    const totalQuestions = quizQuery.data?.questions.length ?? 0;
    const answeredQuestionIds = new Set(
      Object.entries(selectedAnswers)
        .filter(([, answerId]) => Boolean(answerId))
        .map(([questionId]) => Number(questionId)),
    );

    if (totalQuestions === 0) {
      setToast({
        variant: "warning",
        message: "This quiz has no questions to submit.",
      });
      return;
    }

    if (answeredQuestionIds.size < totalQuestions) {
      setToast({
        variant: "warning",
        message: `Please answer all ${totalQuestions} questions before submitting.`,
      });
      return;
    }

    const selectedAnswerIds = Object.values(selectedAnswers).filter(Boolean);

    submitQuizMutation.mutate({ quizId, selectedAnswerIds });
  };

  const isLectureCompleted =
    lectureId !== undefined && completedLectureIds.includes(lectureId);

  const isWorkspaceLoading =
    selectedItem?.type === "lecture"
      ? lectureQuery.isLoading || lectureQuery.isFetching
      : selectedItem?.type === "quiz"
        ? quizQuery.isLoading || quizQuery.isFetching
        : false;

  if (!courseId) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
            Course ID is missing from URL.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isCourseLoading) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <WorkspaceSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
            Unable to load this course for learning.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      {toast ? (
        <div className="fixed right-4 top-4 z-50 w-[min(92vw,520px)]">
          <Alert
            variant={toast.variant}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      ) : null}

      <Header />

      <section className="border-b border-gray-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {[
              { label: "Home", to: "/" },
              { label: "My Learning", to: "/student/courses" },
              { label: course.title, to: `/courses/${course.id}` },
            ].map((crumb, index, list) => (
              <div key={crumb.label} className="flex items-center gap-2">
                <Link
                  to={crumb.to}
                  className="transition-colors hover:text-neutral-800"
                >
                  {crumb.label}
                </Link>
                {index < list.length - 1 ? (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : null}
              </div>
            ))}
          </div>

          <h1 className="mt-4 text-xl font-semibold leading-snug text-neutral-800 sm:text-2xl lg:text-3xl">
            {course.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>
              Instructor: {course.instructor?.profile?.fullName ?? "Unknown"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="font-medium">
                {course.average_rating?.toFixed(1)}
              </span>
            </span>
            <span>{course.enrollment_count} students enrolled</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <section className="space-y-6 lg:col-span-2 xl:col-span-3">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-neutral-800 sm:text-2xl">
                {selectedItem?.title ?? "Select a lecture or quiz"}
              </h2>

              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpenCheck className="h-4 w-4" />
                  Type: {selectedItem?.type === "quiz" ? "Quiz" : "Lecture"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  {selectedItem?.type === "quiz" ? (
                    <HelpCircle className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  ID: {selectedItem?.id ?? "-"}
                </span>
              </div>
            </div>

            {isWorkspaceLoading ? <WorkspaceSkeleton /> : null}

            {!isWorkspaceLoading && selectedItem?.type === "lecture" ? (
              lectureQuery.isError ? (
                <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
                  Unable to load lecture content.
                </div>
              ) : lectureQuery.data ? (
                <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-semibold text-neutral-800">
                      {lectureQuery.data.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Section: {lectureQuery.data.section.title}
                    </p>
                  </div>

                  <article
                    className={cn(
                      "text-base leading-8 text-gray-700",
                      "[&_h1]:mb-5 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:text-neutral-900",
                      "[&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-neutral-900",
                      "[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-neutral-900",
                      "[&_p]:mb-4 [&_p]:leading-8",
                      "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
                      "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
                      "[&_li]:leading-8",
                    )}
                    dangerouslySetInnerHTML={{
                      __html:
                        lectureQuery.data.contentText?.trim() ||
                        "<p>This lecture currently has no content.</p>",
                    }}
                  />

                  <div className="border-t border-gray-100 pt-6">
                    <Button
                      colorScheme={isLectureCompleted ? "success" : "primary"}
                      isLoading={markLectureCompletedMutation.isPending}
                      onClick={() => {
                        if (!lectureId || isLectureCompleted) {
                          return;
                        }
                        markLectureCompletedMutation.mutate(lectureId);
                      }}
                      disabled={isLectureCompleted}
                    >
                      {isLectureCompleted ? "Completed" : "Mark as Complete"}
                    </Button>
                  </div>
                </section>
              ) : null
            ) : null}

            {!isWorkspaceLoading && selectedItem?.type === "quiz" ? (
              quizQuery.isError ? (
                <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-danger-700">
                  Unable to load quiz detail.
                </div>
              ) : quizQuery.data ? (
                <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-3 text-3xl font-semibold text-neutral-800">
                      <Brain className="h-8 w-8 text-primary-500" />
                      {quizQuery.data.title}
                    </h3>
                    {quizQuery.data.description ? (
                      <p className="text-base text-gray-600">
                        {quizQuery.data.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-6">
                    {quizQuery.data.questions.map((question, index) => (
                      <article
                        key={question.id}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 p-5"
                      >
                        <h4 className="text-lg font-semibold text-neutral-800">
                          {index + 1}. {question.content}
                        </h4>

                        <div className="mt-4 space-y-3">
                          {question.answers.map((answer) => {
                            const isSelected =
                              selectedAnswers[question.id] === answer.id;

                            return (
                              <label
                                key={answer.id}
                                className={cn(
                                  "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition",
                                  isSelected
                                    ? "border-primary-300 bg-primary-100"
                                    : "border-gray-200 bg-white hover:bg-gray-50",
                                )}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={answer.id}
                                  checked={isSelected}
                                  onChange={() => {
                                    setSelectedAnswers((current) => ({
                                      ...current,
                                      [question.id]: answer.id,
                                    }));
                                  }}
                                  className="h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {answer.content}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-600">
                      Answered {Object.keys(selectedAnswers).length}/
                      {quizQuery.data.questions.length} questions
                    </p>

                    <Button
                      colorScheme="warning"
                      isLoading={submitQuizMutation.isPending}
                      disabled={Boolean(quizResultModal)}
                      onClick={handleSubmitQuiz}
                    >
                      Submit Quiz
                    </Button>
                  </div>
                </section>
              ) : null
            ) : null}

            {!isWorkspaceLoading && !selectedItem ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-gray-600">
                This course has no lecture or quiz content yet.
              </div>
            ) : null}
          </section>

          <aside className="space-y-4 lg:col-span-1">
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-neutral-800">
                  Course Contents
                </h3>
                <span className="text-sm font-semibold text-green-600">
                  {progressPercent}% Completed
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <LearningCurriculum
              sections={curriculumSections}
              activeType={selectedItem?.type as LearningContentType | undefined}
              activeId={selectedItem?.id}
              onSelectItem={handleSelectItem}
            />
          </aside>
        </div>
      </main>

      <Footer />

      {quizResultModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-neutral-800">
              Quiz Result
            </h3>

            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                Score:{" "}
                <span className="font-semibold">{quizResultModal.score}%</span>
              </p>
              <p>
                Correct:{" "}
                <span className="font-semibold">
                  {quizResultModal.correctAnswers}
                </span>{" "}
                /
                <span className="font-semibold">
                  {" "}
                  {quizResultModal.totalQuestions}
                </span>
              </p>
              <p
                className={cn(
                  "font-medium",
                  quizResultModal.isPassed
                    ? "text-success-600"
                    : "text-danger-600",
                )}
              >
                {quizResultModal.isPassed
                  ? "Passed (100%)"
                  : "Not passed. Quiz chỉ pass khi đạt 100%."}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => setQuizResultModal(null)}
              >
                Stay Here
              </Button>

              <Button
                colorScheme="primary"
                disabled={
                  !quizResultModal.isPassed || !quizResultModal.nextItem
                }
                onClick={() => {
                  const nextItem = quizResultModal.nextItem;
                  setQuizResultModal(null);
                  if (nextItem) {
                    goToNextItem({
                      id: quizResultModal.quizId,
                      type: "quiz",
                      title: "",
                      orderIndex: 0,
                    });
                  }
                }}
              >
                {quizResultModal.nextItem ? "Next Item" : "No Next Item"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {courseCompletionModal.isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-neutral-800">
              <PartyPopper className="h-6 w-6 text-warning-500" />
              Chuc mung ban da hoan thanh khoa hoc
            </h3>

            <p className="mt-3 text-gray-700">
              Ban da dat 100% tien do. Nhan OK de tiep tuc o lai trang hoc.
            </p>

            <div className="mt-6 flex justify-end">
              <Button
                colorScheme="primary"
                onClick={() => {
                  setCourseCompletionModal({ isOpen: false });
                }}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
