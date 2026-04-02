export type ISODateString = string;

export type UserRole = "student" | "instructor" | "admin" | string;

export interface Profile {
  fullName?: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  phone?: string;
  isActive?: boolean;
  rewardPoints: number;
  fullName?: string;
  profile?: Profile;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Answer {
  id: number;
  content: string;
  orderIndex: number;
}

export interface InstructorAnswer extends Answer {
  isCorrect: boolean;
}

export interface Question {
  id: number;
  content: string;
  orderIndex: number;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
  questions?: Question[];
}

export interface Lecture {
  id: number;
  title: string;
  contentText?: string;
  videoUrl?: string;
  orderIndex: number;
}

export interface Section {
  id: number;
  title: string;
  orderIndex: number;
  lectures?: Lecture[];
  quizzes?: Quiz[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  discountPercent: number;
  averageRating?: number;
  reviewCount?: number;
  enrollmentCount?: number;
  isActive?: boolean;
  publishedAt?: ISODateString;
  category?: Category;
  tags?: Tag[];
  instructor?: User;
  sections?: Section[];
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
  user?: Pick<User, "id" | "email"> & {
    profile?: Pick<Profile, "fullName" | "avatar">;
  };
}

export interface Enrollment {
  id: number;
  progressPercent: number;
  completedAt?: ISODateString;
  enrolledAt: ISODateString;
  course?: Course;
  user?: User;
}

export interface MyLearningCourse {
  courseId: number;
  title: string;
  image: string | null;
  progressPercentage: number;
}

export interface LectureDetail extends Lecture {
  section: Pick<Section, "id" | "title" | "orderIndex">;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  otp: string;
  role?: "student" | "instructor";
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface CourseListParams {
  categoryId?: number;
  keyword?: string;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: "best_seller" | "newest" | "price_asc" | "price_desc" | "top_rated";
  priceType?: "free" | "paid";
  isDiscounted?: boolean;
}
