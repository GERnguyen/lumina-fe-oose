import { Plus, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import courseService from "../../services/course.service";
import {
  isBasicDraftComplete,
  useCreateCourseDraftStore,
} from "../../stores/useCreateCourseDraftStore";

type LectureDraft = {
  id: string;
  title: string;
  contentText: string;
  orderIndex: number;
};

type AnswerDraft = {
  id: string;
  content: string;
  isCorrect: boolean;
};

type QuestionDraft = {
  id: string;
  content: string;
  answers: AnswerDraft[];
};

type QuizDraft = {
  id: string;
  title: string;
  orderIndex: number;
  questions: QuestionDraft[];
};

type SectionDraft = {
  id: string;
  title: string;
  orderIndex: number;
  lectures: LectureDraft[];
  quizzes: QuizDraft[];
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyAnswer(): AnswerDraft {
  return {
    id: createId(),
    content: "",
    isCorrect: false,
  };
}

function createEmptyQuestion(): QuestionDraft {
  return {
    id: createId(),
    content: "",
    answers: [createEmptyAnswer(), createEmptyAnswer()],
  };
}

function createEmptyQuiz(orderIndex: number): QuizDraft {
  return {
    id: createId(),
    title: "",
    orderIndex,
    questions: [createEmptyQuestion()],
  };
}

function createEmptyLecture(orderIndex: number): LectureDraft {
  return {
    id: createId(),
    title: "",
    contentText: "",
    orderIndex,
  };
}

function createEmptySection(orderIndex: number): SectionDraft {
  return {
    id: createId(),
    title: "",
    orderIndex,
    lectures: [createEmptyLecture(1)],
    quizzes: [],
  };
}

export default function CreateCourseCurriculum() {
  const navigate = useNavigate();
  const {
    basic,
    sections: storedSections,
    setSections: setStoredSections,
    resetDraft,
  } = useCreateCourseDraftStore();
  const [sections, setSections] = useState<SectionDraft[]>(
    storedSections.length > 0 ? storedSections : [createEmptySection(1)],
  );
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdCourseTitle, setCreatedCourseTitle] = useState("");

  const isBasicComplete = isBasicDraftComplete(basic);

  const updateSection = (
    sectionId: string,
    updater: (section: SectionDraft) => SectionDraft,
  ) => {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? updater(section) : section,
      ),
    );
  };

  const addSection = () => {
    setSections((current) => [
      ...current,
      createEmptySection(current.length + 1),
    ]);
  };

  const addLecture = (sectionId: string) => {
    updateSection(sectionId, (section) => ({
      ...section,
      lectures: [
        ...section.lectures,
        createEmptyLecture(section.lectures.length + 1),
      ],
    }));
  };

  const addQuiz = (sectionId: string) => {
    updateSection(sectionId, (section) => ({
      ...section,
      quizzes: [
        ...section.quizzes,
        createEmptyQuiz(section.quizzes.length + 1),
      ],
    }));
  };

  useEffect(() => {
    setStoredSections(sections);
  }, [sections, setStoredSections]);

  const buildValidationErrors = (): string[] => {
    const errors: string[] = [];

    if (!isBasicComplete) {
      errors.push("Basic information is incomplete. Please complete it first.");
    }

    if (sections.length === 0) {
      errors.push("At least one section is required.");
      return errors;
    }

    sections.forEach((section, sectionIndex) => {
      const sectionLabel = `Section ${sectionIndex + 1}`;

      if (!section.title.trim()) {
        errors.push(`${sectionLabel}: title is required.`);
      }

      if (!Number.isInteger(section.orderIndex) || section.orderIndex <= 0) {
        errors.push(`${sectionLabel}: order index must be a positive integer.`);
      }

      if (section.lectures.length === 0 && section.quizzes.length === 0) {
        errors.push(`${sectionLabel}: add at least one lecture or quiz.`);
      }

      section.lectures.forEach((lecture, lectureIndex) => {
        const lectureLabel = `${sectionLabel} - Lecture ${lectureIndex + 1}`;

        if (!lecture.title.trim()) {
          errors.push(`${lectureLabel}: title is required.`);
        }

        if (!Number.isInteger(lecture.orderIndex) || lecture.orderIndex <= 0) {
          errors.push(
            `${lectureLabel}: order index must be a positive integer.`,
          );
        }
      });

      section.quizzes.forEach((quiz, quizIndex) => {
        const quizLabel = `${sectionLabel} - Quiz ${quizIndex + 1}`;

        if (!quiz.title.trim()) {
          errors.push(`${quizLabel}: title is required.`);
        }

        if (!Number.isInteger(quiz.orderIndex) || quiz.orderIndex <= 0) {
          errors.push(`${quizLabel}: order index must be a positive integer.`);
        }

        if (quiz.questions.length === 0) {
          errors.push(`${quizLabel}: at least one question is required.`);
        }

        quiz.questions.forEach((question, questionIndex) => {
          const questionLabel = `${quizLabel} - Question ${questionIndex + 1}`;

          if (!question.content.trim()) {
            errors.push(`${questionLabel}: content is required.`);
          }

          if (question.answers.length === 0) {
            errors.push(`${questionLabel}: at least one answer is required.`);
            return;
          }

          if (question.answers.some((answer) => !answer.content.trim())) {
            errors.push(`${questionLabel}: each answer must include content.`);
          }

          if (!question.answers.some((answer) => answer.isCorrect)) {
            errors.push(`${questionLabel}: mark at least one correct answer.`);
          }
        });
      });
    });

    return errors;
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const course = await courseService.createCourse({
        title: basic.title.trim(),
        slug:
          basic.title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-") || `course-${Date.now()}`,
        description: basic.description.trim(),
        thumbnailUrl: basic.thumbnailUrl.trim(),
        categoryId: Number(basic.categoryId),
        price: Number.isFinite(Number(basic.price)) ? Number(basic.price) : 0,
        tags: basic.tags,
      });

      for (const section of sections) {
        const createdSection = await courseService.createSection(course.id, {
          title: section.title.trim(),
          orderIndex: section.orderIndex,
        });

        for (const lecture of section.lectures) {
          await courseService.createLecture(createdSection.id, {
            title: lecture.title.trim(),
            contentText: lecture.contentText.trim(),
            orderIndex: lecture.orderIndex,
          });
        }

        for (const quiz of section.quizzes) {
          const createdQuiz = await courseService.createQuiz(
            createdSection.id,
            {
              title: quiz.title.trim(),
            },
          );

          for (const question of quiz.questions) {
            await courseService.createQuestion(createdQuiz.id, {
              content: question.content.trim(),
              answers: question.answers.map((answer) => ({
                content: answer.content.trim(),
                isCorrect: answer.isCorrect,
              })),
            });
          }
        }
      }

      return course;
    },
    onSuccess: (course) => {
      setCreatedCourseTitle(course.title);
      setSubmitErrors([]);
      setIsSuccessModalOpen(true);
    },
    onError: (error: unknown) => {
      let message = "Failed to submit course for review.";

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
        message = (error.response as { data?: { message?: string } }).data
          ?.message as string;
      }

      setSubmitErrors([message]);
    },
  });

  const handleSubmitForReview = () => {
    const validationErrors = buildValidationErrors();

    if (validationErrors.length > 0) {
      setSubmitErrors(validationErrors);
      return;
    }

    setSubmitErrors([]);
    setStoredSections(sections);
    submitMutation.mutate();
  };

  return (
    <div className="space-y-8">
      {!isBasicComplete ? (
        <div className="rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-700">
          Please complete Basic Information first.
        </div>
      ) : null}

      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        {sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            className="space-y-5 rounded-xl border border-gray-200 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Section {sectionIndex + 1}
              </h3>
              <Button
                variant="ghost"
                colorScheme="danger"
                size="sm"
                disabled={sections.length === 1}
                onClick={() =>
                  setSections((current) =>
                    current.filter((item) => item.id !== section.id),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Section Title"
                placeholder="Chuong 1: Gioi thieu"
                value={section.title}
                onChange={(event) =>
                  updateSection(section.id, (currentSection) => ({
                    ...currentSection,
                    title: event.target.value,
                  }))
                }
              />
              <Input
                label="Order Index"
                type="number"
                min={1}
                value={String(section.orderIndex)}
                onChange={(event) =>
                  updateSection(section.id, (currentSection) => ({
                    ...currentSection,
                    orderIndex: Number(event.target.value) || 1,
                  }))
                }
              />
            </div>

            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-base font-semibold text-neutral-800">
                  Lectures
                </h4>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  size="sm"
                  onClick={() => addLecture(section.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add Lecture
                </Button>
              </div>

              <div className="space-y-4">
                {section.lectures.map((lecture, lectureIndex) => (
                  <div
                    key={lecture.id}
                    className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-neutral-800">
                        Lecture {lectureIndex + 1}
                      </p>
                      <Button
                        variant="ghost"
                        colorScheme="danger"
                        size="sm"
                        disabled={section.lectures.length === 1}
                        onClick={() =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            lectures: currentSection.lectures.filter(
                              (item) => item.id !== lecture.id,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Input
                        label="Title"
                        placeholder="Lecture 1"
                        value={lecture.title}
                        onChange={(event) =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            lectures: currentSection.lectures.map((item) =>
                              item.id === lecture.id
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                      <Input
                        label="Order Index"
                        type="number"
                        min={1}
                        value={String(lecture.orderIndex)}
                        onChange={(event) =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            lectures: currentSection.lectures.map((item) =>
                              item.id === lecture.id
                                ? {
                                    ...item,
                                    orderIndex: Number(event.target.value) || 1,
                                  }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>

                    <label className="space-y-1.5">
                      <span className="block text-sm font-medium text-neutral-800">
                        Content Text
                      </span>
                      <textarea
                        className="h-28 w-full resize-none rounded-lg bg-white px-4 py-3 text-neutral-800 outline outline-1 outline-gray-400 outline-offset-[-1px] placeholder:text-gray-500 focus:outline-2 focus:outline-primary-500"
                        placeholder="Noi dung bai hoc"
                        value={lecture.contentText}
                        onChange={(event) =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            lectures: currentSection.lectures.map((item) =>
                              item.id === lecture.id
                                ? { ...item, contentText: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-base font-semibold text-neutral-800">
                  Quizzes
                </h4>
                <Button
                  variant="outline"
                  colorScheme="primary"
                  size="sm"
                  onClick={() => addQuiz(section.id)}
                >
                  <Plus className="h-4 w-4" />
                  Add Quiz
                </Button>
              </div>

              {section.quizzes.length === 0 ? (
                <p className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                  No quiz yet. Add one to create questions and answers.
                </p>
              ) : null}

              <div className="space-y-4">
                {section.quizzes.map((quiz, quizIndex) => (
                  <div
                    key={quiz.id}
                    className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-neutral-800">
                        Quiz {quizIndex + 1}
                      </p>
                      <Button
                        variant="ghost"
                        colorScheme="danger"
                        size="sm"
                        onClick={() =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            quizzes: currentSection.quizzes.filter(
                              (item) => item.id !== quiz.id,
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Input
                        label="Quiz Title"
                        placeholder="Quiz chuong 1"
                        value={quiz.title}
                        onChange={(event) =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            quizzes: currentSection.quizzes.map((item) =>
                              item.id === quiz.id
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          }))
                        }
                      />
                      <Input
                        label="Order Index"
                        type="number"
                        min={1}
                        value={String(quiz.orderIndex)}
                        onChange={(event) =>
                          updateSection(section.id, (currentSection) => ({
                            ...currentSection,
                            quizzes: currentSection.quizzes.map((item) =>
                              item.id === quiz.id
                                ? {
                                    ...item,
                                    orderIndex: Number(event.target.value) || 1,
                                  }
                                : item,
                            ),
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h5 className="text-sm font-semibold text-neutral-800">
                          Questions
                        </h5>
                        <Button
                          variant="outline"
                          colorScheme="primary"
                          size="sm"
                          onClick={() =>
                            updateSection(section.id, (currentSection) => ({
                              ...currentSection,
                              quizzes: currentSection.quizzes.map((item) =>
                                item.id === quiz.id
                                  ? {
                                      ...item,
                                      questions: [
                                        ...item.questions,
                                        createEmptyQuestion(),
                                      ],
                                    }
                                  : item,
                              ),
                            }))
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add Question
                        </Button>
                      </div>

                      {quiz.questions.map((question, questionIndex) => (
                        <div
                          key={question.id}
                          className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-neutral-800">
                              Question {questionIndex + 1}
                            </p>
                            <Button
                              variant="ghost"
                              colorScheme="danger"
                              size="sm"
                              disabled={quiz.questions.length === 1}
                              onClick={() =>
                                updateSection(section.id, (currentSection) => ({
                                  ...currentSection,
                                  quizzes: currentSection.quizzes.map((item) =>
                                    item.id === quiz.id
                                      ? {
                                          ...item,
                                          questions: item.questions.filter(
                                            (entry) => entry.id !== question.id,
                                          ),
                                        }
                                      : item,
                                  ),
                                }))
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>

                          <Input
                            label="Question Content"
                            placeholder="2 + 2 = ?"
                            value={question.content}
                            onChange={(event) =>
                              updateSection(section.id, (currentSection) => ({
                                ...currentSection,
                                quizzes: currentSection.quizzes.map((item) =>
                                  item.id === quiz.id
                                    ? {
                                        ...item,
                                        questions: item.questions.map(
                                          (entry) =>
                                            entry.id === question.id
                                              ? {
                                                  ...entry,
                                                  content: event.target.value,
                                                }
                                              : entry,
                                        ),
                                      }
                                    : item,
                                ),
                              }))
                            }
                          />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Answers
                              </p>
                              <Button
                                variant="ghost"
                                colorScheme="primary"
                                size="sm"
                                onClick={() =>
                                  updateSection(
                                    section.id,
                                    (currentSection) => ({
                                      ...currentSection,
                                      quizzes: currentSection.quizzes.map(
                                        (item) =>
                                          item.id === quiz.id
                                            ? {
                                                ...item,
                                                questions: item.questions.map(
                                                  (entry) =>
                                                    entry.id === question.id
                                                      ? {
                                                          ...entry,
                                                          answers: [
                                                            ...entry.answers,
                                                            createEmptyAnswer(),
                                                          ],
                                                        }
                                                      : entry,
                                                ),
                                              }
                                            : item,
                                      ),
                                    }),
                                  )
                                }
                              >
                                <Plus className="h-4 w-4" />
                                Add Answer
                              </Button>
                            </div>

                            {question.answers.map((answer, answerIndex) => (
                              <div
                                key={answer.id}
                                className="grid grid-cols-1 items-center gap-2 md:grid-cols-[1fr_auto_auto]"
                              >
                                <Input
                                  placeholder={`Answer ${answerIndex + 1}`}
                                  value={answer.content}
                                  onChange={(event) =>
                                    updateSection(
                                      section.id,
                                      (currentSection) => ({
                                        ...currentSection,
                                        quizzes: currentSection.quizzes.map(
                                          (item) =>
                                            item.id === quiz.id
                                              ? {
                                                  ...item,
                                                  questions: item.questions.map(
                                                    (entry) =>
                                                      entry.id === question.id
                                                        ? {
                                                            ...entry,
                                                            answers:
                                                              entry.answers.map(
                                                                (candidate) =>
                                                                  candidate.id ===
                                                                  answer.id
                                                                    ? {
                                                                        ...candidate,
                                                                        content:
                                                                          event
                                                                            .target
                                                                            .value,
                                                                      }
                                                                    : candidate,
                                                              ),
                                                          }
                                                        : entry,
                                                  ),
                                                }
                                              : item,
                                        ),
                                      }),
                                    )
                                  }
                                />

                                <label className="flex items-center gap-2 text-sm text-neutral-700">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                    checked={answer.isCorrect}
                                    onChange={() =>
                                      updateSection(
                                        section.id,
                                        (currentSection) => ({
                                          ...currentSection,
                                          quizzes: currentSection.quizzes.map(
                                            (item) =>
                                              item.id === quiz.id
                                                ? {
                                                    ...item,
                                                    questions:
                                                      item.questions.map(
                                                        (entry) =>
                                                          entry.id ===
                                                          question.id
                                                            ? {
                                                                ...entry,
                                                                answers:
                                                                  entry.answers.map(
                                                                    (
                                                                      candidate,
                                                                    ) =>
                                                                      candidate.id ===
                                                                      answer.id
                                                                        ? {
                                                                            ...candidate,
                                                                            isCorrect:
                                                                              !candidate.isCorrect,
                                                                          }
                                                                        : candidate,
                                                                  ),
                                                              }
                                                            : entry,
                                                      ),
                                                  }
                                                : item,
                                          ),
                                        }),
                                      )
                                    }
                                  />
                                  Correct
                                </label>

                                <Button
                                  variant="ghost"
                                  colorScheme="danger"
                                  size="sm"
                                  disabled={question.answers.length <= 2}
                                  onClick={() =>
                                    updateSection(
                                      section.id,
                                      (currentSection) => ({
                                        ...currentSection,
                                        quizzes: currentSection.quizzes.map(
                                          (item) =>
                                            item.id === quiz.id
                                              ? {
                                                  ...item,
                                                  questions: item.questions.map(
                                                    (entry) =>
                                                      entry.id === question.id
                                                        ? {
                                                            ...entry,
                                                            answers:
                                                              entry.answers.filter(
                                                                (candidate) =>
                                                                  candidate.id !==
                                                                  answer.id,
                                                              ),
                                                          }
                                                        : entry,
                                                  ),
                                                }
                                              : item,
                                        ),
                                      }),
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <Button
          variant="outline"
          colorScheme="primary"
          className="w-full"
          onClick={addSection}
        >
          <Plus className="h-4 w-4" />
          Add Section
        </Button>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          colorScheme="gray"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/basic")}
        >
          Previous
        </Button>
        <Button
          colorScheme="primary"
          className="w-full sm:w-auto"
          isLoading={submitMutation.isPending}
          onClick={handleSubmitForReview}
        >
          Submit for review
        </Button>
      </div>

      {submitErrors.length > 0 ? (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {submitErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {isSuccessModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-neutral-800">
              Submit successful
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Course
              {createdCourseTitle ? ` \"${createdCourseTitle}\"` : ""} has been
              submitted for review.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  resetDraft();
                  navigate("/instructor/create-course/basic");
                }}
              >
                Create another
              </Button>
              <Button
                colorScheme="primary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  resetDraft();
                  navigate("/instructor/courses");
                }}
              >
                Go to my courses
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
