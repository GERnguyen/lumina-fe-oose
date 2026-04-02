import { BookOpenCheck, CircleCheck, PlayCircle, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CourseProgressCardProps } from "../components/CourseProgressCard";

export interface StudentStatItem {
  icon: LucideIcon;
  count: number;
  label: string;
  theme: "primary" | "secondary" | "success" | "warning";
}

export const studentStats: StudentStatItem[] = [
  {
    icon: BookOpenCheck,
    count: 957,
    label: "Enrolled Courses",
    theme: "primary",
  },
  {
    icon: PlayCircle,
    count: 6,
    label: "Active Courses",
    theme: "secondary",
  },
  {
    icon: CircleCheck,
    count: 951,
    label: "Completed Courses",
    theme: "success",
  },
  {
    icon: Users,
    count: 241,
    label: "Course Instructors",
    theme: "warning",
  },
];

export const studentLearningCourses: CourseProgressCardProps[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Reiki Level I, II and Master/Teacher Program",
    currentLecture: "1. Introductions",
    progressPercentage: 0,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "The Complete 2021 Web Development Bootcamp",
    currentLecture: "167. What You'll Need to Get Started - Setup",
    progressPercentage: 61,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Copywriting - Become a Freelance Copywriter",
    currentLecture: "1. How to get started with figma",
    progressPercentage: 0,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "2021 Complete Python Bootcamp From Zero to Hero",
    currentLecture: "9. Advanced CSS - Selector Priority",
    progressPercentage: 12,
  },
];
