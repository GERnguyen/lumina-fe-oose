import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CourseAnswerDraft {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface CourseQuestionDraft {
  id: string;
  content: string;
  answers: CourseAnswerDraft[];
}

export interface CourseQuizDraft {
  id: string;
  title: string;
  orderIndex: number;
  questions: CourseQuestionDraft[];
}

export interface CourseLectureDraft {
  id: string;
  title: string;
  contentText: string;
  orderIndex: number;
}

export interface CourseSectionDraft {
  id: string;
  title: string;
  orderIndex: number;
  lectures: CourseLectureDraft[];
  quizzes: CourseQuizDraft[];
}

export interface CreateCourseBasicDraft {
  title: string;
  categoryId: number | null;
  description: string;
  thumbnailUrl: string;
  price: number;
  tags: string[];
}

interface CreateCourseDraftState {
  basic: CreateCourseBasicDraft;
  sections: CourseSectionDraft[];
  setBasic: (patch: Partial<CreateCourseBasicDraft>) => void;
  setSections: (sections: CourseSectionDraft[]) => void;
  resetDraft: () => void;
}

export const initialBasicDraft: CreateCourseBasicDraft = {
  title: "",
  categoryId: null,
  description: "",
  thumbnailUrl: "",
  price: 0,
  tags: [],
};

export function isBasicDraftComplete(basic: CreateCourseBasicDraft): boolean {
  return Boolean(
    basic.title.trim() &&
    basic.categoryId &&
    basic.description.trim() &&
    basic.thumbnailUrl.trim(),
  );
}

export const useCreateCourseDraftStore = create<CreateCourseDraftState>()(
  persist(
    (set) => ({
      basic: initialBasicDraft,
      sections: [],
      setBasic: (patch) =>
        set((state) => ({
          basic: {
            ...state.basic,
            ...patch,
          },
        })),
      setSections: (sections) => set({ sections }),
      resetDraft: () =>
        set({
          basic: initialBasicDraft,
          sections: [],
        }),
    }),
    {
      name: "create-course-draft",
    },
  ),
);
