import type { Course } from "./course";

export interface CartItem {
  id: number;
  courseId: number;
  unit_price: number;
  quantity: number;
  course: Course;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}
