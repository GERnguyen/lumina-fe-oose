import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useCategories } from "../../hooks/queries/useCategories";
import courseService from "../../services/course.service";

type TabKey = "students" | "content";

type AnswerDraft = {
  id?: number;
  localId: string;
  content: string;
  isCorrect: boolean;
};

type QuestionDraft = {
  id?: number;
  localId: string;
  content: string;
  answers: AnswerDraft[];
};

type QuizDraft = {
  id?: number;
  localId: string;
  title: string;
  orderIndex: number;
  questions: QuestionDraft[];
};

type LectureDraft = {
  id?: number;
  localId: string;
  title: string;
  contentText: string;
  orderIndex: number;
};

type SectionDraft = {
  id?: number;
  localId: string;
  title: string;
  orderIndex: number;
  lectures: LectureDraft[];
  quizzes: QuizDraft[];
};

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mapQuestions(
  questions: Array<{
    id: number;
    content: string;
    answers: Array<{ id: number; content: string; isCorrect: boolean }>;
  }>,
): QuestionDraft[] {
  return questions.map((question) => ({
    id: question.id,
    localId: createLocalId(),
    content: question.content,
    answers: question.answers.map((answer) => ({
      id: answer.id,
      localId: createLocalId(),
      content: answer.content,
      isCorrect: answer.isCorrect,
    })),
  }));
}

export default function ManageCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const categoriesQuery = useCategories();
  const numericCourseId = Number(courseId);

  const [activeTab, setActiveTab] = useState<TabKey>("students");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [sections, setSections] = useState<SectionDraft[]>([]);

  const courseQuery = useQuery({
    queryKey: ["instructor", "course-detail", numericCourseId],
    queryFn: () => courseService.getInstructorCourseDetail(numericCourseId),
    enabled: Number.isFinite(numericCourseId) && numericCourseId > 0,
  });

  const studentsQuery = useQuery({
    queryKey: ["instructor", "course-students", numericCourseId],
    queryFn: () => courseService.getInstructorCourseStudents(numericCourseId),
    enabled: Number.isFinite(numericCourseId) && numericCourseId > 0,
  });

  const questionsQueries = useQuery({
    queryKey: [
      "instructor",
      "course-questions",
      numericCourseId,
      courseQuery.data?.id,
    ],
    queryFn: async () => {
      const course = courseQuery.data;
      if (!course) {
        return new Map<number, QuestionDraft[]>();
      }

      const quizIds = (course.sections ?? []).flatMap((section) =>
        (section.quizzes ?? []).map((quiz) => quiz.id),
      );

      const results = await Promise.all(
        quizIds.map(async (quizId) => {
          const questions =
            await courseService.getInstructorQuizQuestions(quizId);
          return {
            quizId,
            questions: mapQuestions(questions),
          };
        }),
      );

      return new Map<number, QuestionDraft[]>(
        results.map((item) => [item.quizId, item.questions]),
      );
    },
    enabled:
      courseQuery.isSuccess &&
      Number.isFinite(numericCourseId) &&
      numericCourseId > 0,
  });

  useEffect(() => {
    if (!courseQuery.data || !questionsQueries.data) {
      return;
    }

    const course = courseQuery.data;
    setTitle(course.title);
    setDescription(course.description ?? "");
    setThumbnailUrl(course.thumbnail_url ?? "");
    setPrice(course.price ?? 0);
    setCategoryId(course.category?.id ?? null);
    setSections(
      (course.sections ?? []).map((section) => ({
        id: section.id,
        localId: createLocalId(),
        title: section.title,
        orderIndex: section.orderIndex,
        lectures: (section.lectures ?? []).map((lecture) => ({
          id: lecture.id,
          localId: createLocalId(),
          title: lecture.title,
          contentText: lecture.contentText ?? "",
          orderIndex: lecture.orderIndex,
        })),
        quizzes: (section.quizzes ?? []).map((quiz) => ({
          id: quiz.id,
          localId: createLocalId(),
          title: quiz.title,
          orderIndex: quiz.orderIndex,
          questions: questionsQueries.data?.get(quiz.id) ?? [],
        })),
      })),
    );
  }, [courseQuery.data, questionsQueries.data]);

  const validationErrors = (): string[] => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Course title is required.");
    }

    if (!description.trim()) {
      errors.push("Course description is required.");
    }

    if (!thumbnailUrl.trim()) {
      errors.push("Thumbnail URL is required.");
    }

    if (!categoryId) {
      errors.push("Course category is required.");
    }

    sections.forEach((section, sectionIndex) => {
      if (!section.title.trim()) {
        errors.push(`Section ${sectionIndex + 1}: title is required.`);
      }

      section.lectures.forEach((lecture, lectureIndex) => {
        if (!lecture.title.trim()) {
          errors.push(
            `Section ${sectionIndex + 1} Lecture ${lectureIndex + 1}: title is required.`,
          );
        }
      });

      section.quizzes.forEach((quiz, quizIndex) => {
        if (!quiz.title.trim()) {
          errors.push(
            `Section ${sectionIndex + 1} Quiz ${quizIndex + 1}: title is required.`,
          );
        }

        quiz.questions.forEach((question, questionIndex) => {
          if (!question.content.trim()) {
            errors.push(
              `Section ${sectionIndex + 1} Quiz ${quizIndex + 1} Question ${questionIndex + 1}: content is required.`,
            );
          }

          if (!question.answers.some((answer) => answer.isCorrect)) {
            errors.push(
              `Section ${sectionIndex + 1} Quiz ${quizIndex + 1} Question ${questionIndex + 1}: mark at least one correct answer.`,
            );
          }
        });
      });
    });

    return errors;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await courseService.updateInstructorCourse(numericCourseId, {
        title: title.trim(),
        slug:
          title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-") || `course-${numericCourseId}`,
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        categoryId: Number(categoryId),
        price,
      });

      for (const section of sections) {
        const sectionResponse = section.id
          ? await courseService.updateSection(section.id, {
              title: section.title.trim(),
              orderIndex: section.orderIndex,
            })
          : await courseService.createSection(numericCourseId, {
              title: section.title.trim(),
              orderIndex: section.orderIndex,
            });

        const currentSectionId =
          section.id ?? (sectionResponse as { id: number }).id;

        for (const lecture of section.lectures) {
          if (lecture.id) {
            await courseService.updateLecture(lecture.id, {
              title: lecture.title.trim(),
              contentText: lecture.contentText.trim(),
              orderIndex: lecture.orderIndex,
            });
          } else {
            await courseService.createLecture(currentSectionId, {
              title: lecture.title.trim(),
              contentText: lecture.contentText.trim(),
              orderIndex: lecture.orderIndex,
            });
          }
        }

        for (const quiz of section.quizzes) {
          const quizResponse = quiz.id
            ? await courseService.updateQuiz(quiz.id, {
                title: quiz.title.trim(),
              })
            : await courseService.createQuiz(currentSectionId, {
                title: quiz.title.trim(),
              });

          const currentQuizId = quiz.id ?? (quizResponse as { id: number }).id;

          for (const question of quiz.questions) {
            if (question.id) {
              await courseService.updateQuestion(question.id, {
                content: question.content.trim(),
                answers: question.answers.map((answer) => ({
                  id: answer.id,
                  content: answer.content.trim(),
                  isCorrect: answer.isCorrect,
                })),
              });
            } else {
              await courseService.createQuestion(currentQuizId, {
                content: question.content.trim(),
                answers: question.answers.map((answer) => ({
                  content: answer.content.trim(),
                  isCorrect: answer.isCorrect,
                })),
              });
            }
          }
        }
      }
    },
    onSuccess: () => {
      setErrorMessage("");
      setSuccessMessage("Course content updated successfully.");
    },
    onError: (error: unknown) => {
      setSuccessMessage("");
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof (error.response as { data?: { message?: unknown } }).data
          ?.message === "string"
      ) {
        setErrorMessage(
          (error.response as { data?: { message?: string } }).data?.message ||
            "Failed to save changes.",
        );
        return;
      }

      setErrorMessage("Failed to save changes.");
    },
  });

  const saveChanges = () => {
    const errors = validationErrors();
    if (errors.length > 0) {
      setSuccessMessage("");
      setErrorMessage(errors[0]);
      return;
    }

    setErrorMessage("");
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-800">
          Manage Course
        </h1>
        <Button
          variant="outline"
          colorScheme="gray"
          onClick={() => navigate("/instructor/courses")}
        >
          Back to My Courses
        </Button>
      </div>

      <div className="flex gap-2 rounded-xl border border-gray-200 bg-white p-2">
        <Button
          variant={activeTab === "students" ? "solid" : "ghost"}
          colorScheme={activeTab === "students" ? "primary" : "gray"}
          size="sm"
          onClick={() => setActiveTab("students")}
        >
          Enrolled Users & Progress
        </Button>
        <Button
          variant={activeTab === "content" ? "solid" : "ghost"}
          colorScheme={activeTab === "content" ? "primary" : "gray"}
          size="sm"
          onClick={() => setActiveTab("content")}
        >
          Edit Course Content
        </Button>
      </div>

      {activeTab === "students" ? (
        <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
          {studentsQuery.isLoading ? (
            <p className="text-sm text-gray-500">Loading students...</p>
          ) : null}

          {!studentsQuery.isLoading &&
          (studentsQuery.data ?? []).length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có ai đăng ký.</p>
          ) : null}

          {(studentsQuery.data ?? []).map((item) => (
            <div
              key={item.enrollmentId}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {item.student.fullName || item.student.email}
                </p>
                <p className="text-xs text-gray-500">{item.student.email}</p>
              </div>
              <p className="text-sm font-semibold text-primary-600">
                {Math.round(item.progressPercent)}%
              </p>
            </div>
          ))}
        </section>
      ) : (
        <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Input
              label="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(event) => setThumbnailUrl(event.target.value)}
            />
            <Input
              label="Price"
              type="number"
              min={0}
              value={String(price)}
              onChange={(event) =>
                setPrice(Math.max(0, Number(event.target.value) || 0))
              }
            />
            <label className="space-y-1.5">
              <span className="block text-sm font-medium text-neutral-800">
                Category
              </span>
              <select
                className="h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-base text-neutral-800 outline-none focus:border-primary-500"
                value={categoryId ?? ""}
                onChange={(event) =>
                  setCategoryId(Number(event.target.value) || null)
                }
              >
                <option value="">Select category...</option>
                {(categoriesQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-neutral-800">
              Description
            </span>
            <textarea
              className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-neutral-800 outline-none focus:border-primary-500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          {sections.map((section, sectionIndex) => (
            <div
              key={section.localId}
              className="space-y-4 rounded-xl border border-gray-200 bg-slate-50 p-4"
            >
              <h3 className="font-semibold text-neutral-800">
                Section {sectionIndex + 1}
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="Section Title"
                  value={section.title}
                  onChange={(event) =>
                    setSections((current) =>
                      current.map((item) =>
                        item.localId === section.localId
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
                <Input
                  label="Order Index"
                  type="number"
                  min={1}
                  value={String(section.orderIndex)}
                  onChange={(event) =>
                    setSections((current) =>
                      current.map((item) =>
                        item.localId === section.localId
                          ? {
                              ...item,
                              orderIndex: Number(event.target.value) || 1,
                            }
                          : item,
                      ),
                    )
                  }
                />
              </div>

              <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-neutral-800">
                    Lectures
                  </h4>
                  <Button
                    variant="outline"
                    colorScheme="primary"
                    size="sm"
                    onClick={() =>
                      setSections((current) =>
                        current.map((item) =>
                          item.localId === section.localId
                            ? {
                                ...item,
                                lectures: [
                                  ...item.lectures,
                                  {
                                    localId: createLocalId(),
                                    title: "",
                                    contentText: "",
                                    orderIndex: item.lectures.length + 1,
                                  },
                                ],
                              }
                            : item,
                        ),
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add Lecture
                  </Button>
                </div>

                {section.lectures.map((lecture, lectureIndex) => (
                  <div
                    key={lecture.localId}
                    className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      Lecture {lectureIndex + 1}
                    </p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Input
                        label="Title"
                        value={lecture.title}
                        onChange={(event) =>
                          setSections((current) =>
                            current.map((item) =>
                              item.localId === section.localId
                                ? {
                                    ...item,
                                    lectures: item.lectures.map((entry) =>
                                      entry.localId === lecture.localId
                                        ? {
                                            ...entry,
                                            title: event.target.value,
                                          }
                                        : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                      <Input
                        label="Order Index"
                        type="number"
                        min={1}
                        value={String(lecture.orderIndex)}
                        onChange={(event) =>
                          setSections((current) =>
                            current.map((item) =>
                              item.localId === section.localId
                                ? {
                                    ...item,
                                    lectures: item.lectures.map((entry) =>
                                      entry.localId === lecture.localId
                                        ? {
                                            ...entry,
                                            orderIndex:
                                              Number(event.target.value) || 1,
                                          }
                                        : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                    </div>
                    <label className="space-y-1.5">
                      <span className="block text-sm font-medium text-neutral-800">
                        Content Text
                      </span>
                      <textarea
                        className="h-24 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 outline-none focus:border-primary-500"
                        value={lecture.contentText}
                        onChange={(event) =>
                          setSections((current) =>
                            current.map((item) =>
                              item.localId === section.localId
                                ? {
                                    ...item,
                                    lectures: item.lectures.map((entry) =>
                                      entry.localId === lecture.localId
                                        ? {
                                            ...entry,
                                            contentText: event.target.value,
                                          }
                                        : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-neutral-800">
                    Quizzes
                  </h4>
                  <Button
                    variant="outline"
                    colorScheme="primary"
                    size="sm"
                    onClick={() =>
                      setSections((current) =>
                        current.map((item) =>
                          item.localId === section.localId
                            ? {
                                ...item,
                                quizzes: [
                                  ...item.quizzes,
                                  {
                                    localId: createLocalId(),
                                    title: "",
                                    orderIndex: item.quizzes.length + 1,
                                    questions: [],
                                  },
                                ],
                              }
                            : item,
                        ),
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add Quiz
                  </Button>
                </div>

                {section.quizzes.map((quiz, quizIndex) => (
                  <div
                    key={quiz.localId}
                    className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <p className="text-xs font-semibold text-gray-500">
                      Quiz {quizIndex + 1}
                    </p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Input
                        label="Quiz Title"
                        value={quiz.title}
                        onChange={(event) =>
                          setSections((current) =>
                            current.map((item) =>
                              item.localId === section.localId
                                ? {
                                    ...item,
                                    quizzes: item.quizzes.map((entry) =>
                                      entry.localId === quiz.localId
                                        ? {
                                            ...entry,
                                            title: event.target.value,
                                          }
                                        : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                      <Input
                        label="Order Index"
                        type="number"
                        min={1}
                        value={String(quiz.orderIndex)}
                        onChange={(event) =>
                          setSections((current) =>
                            current.map((item) =>
                              item.localId === section.localId
                                ? {
                                    ...item,
                                    quizzes: item.quizzes.map((entry) =>
                                      entry.localId === quiz.localId
                                        ? {
                                            ...entry,
                                            orderIndex:
                                              Number(event.target.value) || 1,
                                          }
                                        : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-semibold text-neutral-800">
                          Questions
                        </h5>
                        <Button
                          variant="ghost"
                          colorScheme="primary"
                          size="sm"
                          onClick={() =>
                            setSections((current) =>
                              current.map((item) =>
                                item.localId === section.localId
                                  ? {
                                      ...item,
                                      quizzes: item.quizzes.map((entry) =>
                                        entry.localId === quiz.localId
                                          ? {
                                              ...entry,
                                              questions: [
                                                ...entry.questions,
                                                {
                                                  localId: createLocalId(),
                                                  content: "",
                                                  answers: [
                                                    {
                                                      localId: createLocalId(),
                                                      content: "",
                                                      isCorrect: false,
                                                    },
                                                    {
                                                      localId: createLocalId(),
                                                      content: "",
                                                      isCorrect: false,
                                                    },
                                                  ],
                                                },
                                              ],
                                            }
                                          : entry,
                                      ),
                                    }
                                  : item,
                              ),
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add Question
                        </Button>
                      </div>

                      {quiz.questions.map((question, questionIndex) => (
                        <div
                          key={question.localId}
                          className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <p className="text-xs font-semibold text-gray-500">
                            Question {questionIndex + 1}
                          </p>
                          <Input
                            label="Question Content"
                            value={question.content}
                            onChange={(event) =>
                              setSections((current) =>
                                current.map((item) =>
                                  item.localId === section.localId
                                    ? {
                                        ...item,
                                        quizzes: item.quizzes.map(
                                          (quizEntry) =>
                                            quizEntry.localId === quiz.localId
                                              ? {
                                                  ...quizEntry,
                                                  questions:
                                                    quizEntry.questions.map(
                                                      (questionEntry) =>
                                                        questionEntry.localId ===
                                                        question.localId
                                                          ? {
                                                              ...questionEntry,
                                                              content:
                                                                event.target
                                                                  .value,
                                                            }
                                                          : questionEntry,
                                                    ),
                                                }
                                              : quizEntry,
                                        ),
                                      }
                                    : item,
                                ),
                              )
                            }
                          />

                          {question.answers.map((answer, answerIndex) => (
                            <div
                              key={answer.localId}
                              className="grid grid-cols-1 items-center gap-2 md:grid-cols-[1fr_auto]"
                            >
                              <Input
                                placeholder={`Answer ${answerIndex + 1}`}
                                value={answer.content}
                                onChange={(event) =>
                                  setSections((current) =>
                                    current.map((item) =>
                                      item.localId === section.localId
                                        ? {
                                            ...item,
                                            quizzes: item.quizzes.map(
                                              (quizEntry) =>
                                                quizEntry.localId ===
                                                quiz.localId
                                                  ? {
                                                      ...quizEntry,
                                                      questions:
                                                        quizEntry.questions.map(
                                                          (questionEntry) =>
                                                            questionEntry.localId ===
                                                            question.localId
                                                              ? {
                                                                  ...questionEntry,
                                                                  answers:
                                                                    questionEntry.answers.map(
                                                                      (
                                                                        answerEntry,
                                                                      ) =>
                                                                        answerEntry.localId ===
                                                                        answer.localId
                                                                          ? {
                                                                              ...answerEntry,
                                                                              content:
                                                                                event
                                                                                  .target
                                                                                  .value,
                                                                            }
                                                                          : answerEntry,
                                                                    ),
                                                                }
                                                              : questionEntry,
                                                        ),
                                                    }
                                                  : quizEntry,
                                            ),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                              />
                              <label className="flex items-center gap-2 text-sm text-neutral-700">
                                <input
                                  type="checkbox"
                                  checked={answer.isCorrect}
                                  onChange={() =>
                                    setSections((current) =>
                                      current.map((item) =>
                                        item.localId === section.localId
                                          ? {
                                              ...item,
                                              quizzes: item.quizzes.map(
                                                (quizEntry) =>
                                                  quizEntry.localId ===
                                                  quiz.localId
                                                    ? {
                                                        ...quizEntry,
                                                        questions:
                                                          quizEntry.questions.map(
                                                            (questionEntry) =>
                                                              questionEntry.localId ===
                                                              question.localId
                                                                ? {
                                                                    ...questionEntry,
                                                                    answers:
                                                                      questionEntry.answers.map(
                                                                        (
                                                                          answerEntry,
                                                                        ) =>
                                                                          answerEntry.localId ===
                                                                          answer.localId
                                                                            ? {
                                                                                ...answerEntry,
                                                                                isCorrect:
                                                                                  !answerEntry.isCorrect,
                                                                              }
                                                                            : answerEntry,
                                                                      ),
                                                                  }
                                                                : questionEntry,
                                                          ),
                                                      }
                                                    : quizEntry,
                                              ),
                                            }
                                          : item,
                                      ),
                                    )
                                  }
                                />
                                Correct
                              </label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            colorScheme="primary"
            className="w-full"
            onClick={() =>
              setSections((current) => [
                ...current,
                {
                  localId: createLocalId(),
                  title: "",
                  orderIndex: current.length + 1,
                  lectures: [],
                  quizzes: [],
                },
              ])
            }
          >
            <Plus className="h-4 w-4" />
            Add Section
          </Button>

          {errorMessage ? (
            <p className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-lg border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700">
              {successMessage}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              colorScheme="primary"
              isLoading={saveMutation.isPending}
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
