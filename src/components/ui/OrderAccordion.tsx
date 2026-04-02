import {
  ArrowDown,
  Book,
  Calendar,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";

export interface OrderCourseItem {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  date: string;
  totalCourses: number;
  totalAmount: number;
  paymentMethod: string;
  cardLast4?: string;
  billingLabel?: string;
  courses: OrderCourseItem[];
}

export interface OrderAccordionProps {
  order: OrderItem;
  defaultOpen?: boolean;
}

export default function OrderAccordion({
  order,
  defaultOpen = false,
}: OrderAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        className="w-full px-5 py-4 text-left"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{order.date}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="inline-flex items-center gap-1.5 text-gray-600">
              <Book className="h-4 w-4 text-secondary-500" />
              <span>{order.totalCourses} Courses</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-gray-600">
              <DollarSign className="h-4 w-4 text-success-600" />
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-gray-600">
              <CreditCard className="h-4 w-4 text-primary-500" />
              <span>{order.paymentMethod}</span>
            </div>
          </div>

          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <ArrowDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </span>
        </div>
      </button>

      {isOpen ? (
        <div className="space-y-5 border-t border-gray-200 px-5 pb-5 pt-4">
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <p>
              <span className="font-medium text-neutral-800">Amount:</span> $
              {order.totalAmount.toFixed(2)}
            </p>
            <p className="mt-1">
              <span className="font-medium text-neutral-800">Payment:</span>{" "}
              {order.paymentMethod}
              {order.cardLast4 ? ` • **** ${order.cardLast4}` : ""}
            </p>
            {order.billingLabel ? (
              <p className="mt-1">
                <span className="font-medium text-neutral-800">Billing:</span>{" "}
                {order.billingLabel}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {order.courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="h-16 w-20 rounded object-cover"
                />

                <div className="min-w-0 space-y-1">
                  <p className="line-clamp-1 text-sm font-medium text-neutral-800">
                    {course.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-gray-500">
                    {course.author}
                  </p>
                  <p className="text-sm font-semibold text-primary-500">
                    ${course.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
