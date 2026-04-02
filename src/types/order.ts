import type { Course } from "./course";

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

export interface OrderDetail {
  id: number;
  courseId: number;
  unit_price: number;
  discount_amount: number;
  final_price: number;
  course: Course;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  final_price: number;
  created_at: string;
  updated_at: string;
  payment_method?: string;
  paid_at?: string;
  order_details: OrderDetail[];
}
