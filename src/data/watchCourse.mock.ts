export type WatchCourseTab =
  | "description"
  | "notes"
  | "attachments"
  | "comments";

export interface LearningLectureItem {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  active?: boolean;
  isFile?: boolean;
}

export interface LearningSectionItem {
  id: string;
  title: string;
  lectureCount: number;
  totalDuration: string;
  progressText?: string;
  items: LearningLectureItem[];
}

export interface WatchCourseCommentItem {
  id: string;
  avatarUrl: string;
  author: string;
  role?: "Admin";
  timeAgo: string;
  content: string;
}

export interface WatchCourseAttachmentItem {
  id: string;
  fileName: string;
  fileSize: string;
}

export const watchCourseMeta = {
  courseId: "webflow-masterclass",
  courseTitle:
    "Complete Website Responsive Design: from Figma to Webflow to Website Design",
  breadcrumbs: ["Home", "My Learning", "Watch Course"],
  instructor: "Kevin Gilbert",
  rating: 4.8,
  studentsWatching: 512,
  lessonTitle: "2. Sign up in Webflow",
  lessonDuration: "07:31",
  totalDuration: "09:15",
  updatedAt: "Oct 26, 2020",
  commentsCount: 154,
  progressPercent: 15,
};

export const watchCourseDescription =
  "We cover everything you need to build your first website. From creating your first page through to uploading your website to the internet. There are exercise files you can download and then work along with the instructor. If this feels fancy, do not worry, this course is aimed at people new to web design and coding.";

export const watchCourseNotes = [
  "In ut aliquet ante. Curabitur mollis tincidunt turpis, sed aliquam mauris finibus vel.",
  "Morbi sit amet pretium tellus. Donec blandit fermentum tincidunt.",
  "Donec congue aliquam lorem nec congue. Suspendisse eu risus mattis, interdum ante sed, fringilla urna.",
];

export const watchCourseSections: LearningSectionItem[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    lectureCount: 4,
    totalDuration: "51m",
    progressText: "25% finish (1/4)",
    items: [
      {
        id: "lec-1",
        title: "1. What is Webflow?",
        duration: "07:31",
        completed: true,
      },
      {
        id: "lec-2",
        title: "2. Sign up in Webflow",
        duration: "07:31",
        active: true,
      },
      {
        id: "lec-3",
        title: "3. Teaser of Webflow",
        duration: "06:42",
      },
      {
        id: "lec-4",
        title: "4. Figma Introduction",
        duration: "09:20",
      },
    ],
  },
  {
    id: "secret-design",
    title: "Secret of Good Design",
    lectureCount: 52,
    totalDuration: "5h 49m",
    items: [
      {
        id: "lec-5",
        title: "5. Design Principles Overview",
        duration: "12:15",
      },
      {
        id: "lec-6",
        title: "6. Color and Typography Systems",
        duration: "15:42",
      },
    ],
  },
  {
    id: "resources",
    title: "Attach Resources",
    lectureCount: 1,
    totalDuration: "12m",
    items: [
      {
        id: "file-1",
        title: "Create account on webflow.pdf",
        duration: "12.6 MB",
        isFile: true,
      },
    ],
  },
];

export const watchCourseAttachments: WatchCourseAttachmentItem[] = [
  {
    id: "attachment-1",
    fileName: "Create account on webflow.pdf",
    fileSize: "12.6 MB",
  },
];

export const watchCourseComments: WatchCourseCommentItem[] = [
  {
    id: "comment-1",
    avatarUrl: "https://placehold.co/40x40",
    author: "Ronald Richards",
    timeAgo: "1 week ago",
    content:
      "Maecenas risus tortor, tincidunt nec purus eu, gravida suscipit tortor.",
  },
  {
    id: "comment-2",
    avatarUrl: "https://placehold.co/40x40",
    author: "Kristin Watson",
    role: "Admin",
    timeAgo: "1 week ago",
    content:
      "Nulla pellentesque leo vitae lorem hendrerit, sit amet elementum ipsum rutrum.",
  },
  {
    id: "comment-3",
    avatarUrl: "https://placehold.co/40x40",
    author: "Cody Fisher",
    timeAgo: "1 week ago",
    content: "Thank you so much, you are a great mentor.",
  },
  {
    id: "comment-4",
    avatarUrl: "https://placehold.co/40x40",
    author: "Guy Hawkins",
    timeAgo: "2 weeks ago",
    content:
      "Thank you for your helpful video. Could you share which app was used in the animation demo?",
  },
];
