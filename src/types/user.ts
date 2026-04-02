export type UserRole = "student" | "instructor" | "admin" | string;

export interface Profile {
  id: number;
  fullName: string;
  avatar: string;
  bio: string;
  phoneNumber: string;
}

export interface Instructor {
  id: number;
  email: string;
  role: UserRole;
  profile: Profile;
}
