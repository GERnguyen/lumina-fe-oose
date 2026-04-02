import { Star, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddToCart } from "../hooks/queries/useAddToCart";
import { useMyLearningCourses } from "../hooks/queries/useMyLearningCourses";
import { useAuth } from "../hooks/useAuth";
import Alert, { type AlertVariant } from "./ui/Alert";
import Button from "./ui/Button";
import { cn } from "../utils/cn";
import type { Course } from "../types/course";
import { formatCurrencyVnd, getDiscountedPrice } from "../utils/price";

interface PopupState {
  variant: AlertVariant;
  message: string;
}

export interface CourseCardProps {
  course?: Course;
  categoryTone?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "gray";
  imageUrl?: string;
  title?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  students?: number;
  author?: string;
  cartCourseIds?: number[];
}

const categoryToneStyles: Record<
  NonNullable<CourseCardProps["categoryTone"]>,
  string
> = {
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-100 text-success-800",
  warning: "bg-warning-100 text-warning-800",
  danger: "bg-danger-100 text-danger-800",
  gray: "bg-gray-50 text-gray-800",
};

export default function CourseCard({
  categoryTone = "gray",
  ...props
}: CourseCardProps) {
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const { isAuthenticated } = useAuth();
  const { data: myLearningCourses = [] } =
    useMyLearningCourses(isAuthenticated);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const course: Course = props.course
    ? props.course
    : {
        id: 0,
        title: props.title ?? "Untitled",
        slug: "",
        description: "",
        thumbnail_url: props.imageUrl ?? "https://placehold.co/600x400",
        price: Number(props.price) || 0,
        discount_percent:
          props.originalPrice && Number(props.originalPrice) > 0
            ? Math.max(
                0,
                Math.round(
                  (1 - Number(props.price) / Number(props.originalPrice)) * 100,
                ),
              )
            : 0,
        average_rating: Number(props.rating) || 0,
        review_count: 0,
        enrollment_count: Number(props.students) || 0,
        instructor: {
          id: 0,
          email: "",
          role: "instructor",
          profile: {
            id: 0,
            fullName: props.author ?? "Unknown",
            avatar: "https://placehold.co/64x64",
            bio: "",
            phoneNumber: "",
          },
        },
        category: {
          id: 0,
          name: props.category ?? "Other",
          description: "",
          parentId: null,
        },
      };

  const discountedPrice = getDiscountedPrice(
    course.price,
    course.discount_percent,
  );
  const roundedRating = Math.round(course.average_rating);
  const isEnrolled = myLearningCourses.some(
    (learningCourse) => learningCourse.courseId === course.id,
  );
  const isAlreadyInCart = (props.cartCourseIds ?? []).includes(course.id);
  const isAddToCartDisabled = isAlreadyInCart || addToCartMutation.isPending;

  const handleCardClick = () => {
    if (course.id) {
      navigate(`/courses/${course.id}`);
    }
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (!course.id || isAddToCartDisabled) {
      return;
    }

    try {
      await addToCartMutation.mutateAsync(course.id);
      setPopup({
        variant: "success",
        message: "Đã thêm khóa học vào giỏ hàng.",
      });
    } catch {
      setPopup({
        variant: "error",
        message: "Không thể thêm vào giỏ hàng. Vui lòng thử lại.",
      });
    }
  };

  const handleContinueLearning = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (!course.id) {
      return;
    }

    navigate(`/learning/course/${course.id}`);
  };

  return (
    <>
      {popup ? (
        <div className="fixed right-4 top-4 z-50 w-[min(92vw,420px)]">
          <Alert
            variant={popup.variant}
            message={popup.message}
            onClose={() => setPopup(null)}
          />
        </div>
      ) : null}

      <article
        className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        role="link"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
      >
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="h-44 w-full object-cover"
        />
        <div className="flex flex-1 flex-col p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  "rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                  categoryToneStyles[categoryTone],
                )}
              >
                {course.category.name}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-primary-500">
                  {formatCurrencyVnd(discountedPrice)}
                </span>
                {course.discount_percent > 0 ? (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrencyVnd(course.price)}
                  </span>
                ) : null}
              </div>
            </div>

            <h3 className="line-clamp-2 text-base font-semibold text-neutral-800">
              {course.title}
            </h3>

            <p className="text-sm text-gray-600">
              by {course.instructor.profile.fullName}
            </p>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={`star-${course.id}-${index}`}
                    className={cn(
                      "h-4 w-4",
                      index < roundedRating
                        ? "fill-warning-500 text-warning-500"
                        : "fill-gray-200 text-gray-300",
                    )}
                  />
                ))}
                <span className="font-medium text-neutral-800">
                  {course.average_rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-secondary-500" />
                <span>
                  {course.enrollment_count.toLocaleString("vi-VN")} học viên
                </span>
              </div>
            </div>

            {isEnrolled ? (
              <Button
                className="mt-4 w-full"
                colorScheme="primary"
                size="sm"
                onClick={handleContinueLearning}
              >
                Continue learning
              </Button>
            ) : (
              <Button
                className={cn(
                  "mt-4 w-full",
                  isAddToCartDisabled &&
                    "bg-gray-200 text-gray-500 hover:bg-gray-200",
                )}
                colorScheme={isAddToCartDisabled ? "gray" : "primary"}
                size="sm"
                isLoading={addToCartMutation.isPending}
                disabled={isAddToCartDisabled}
                onClick={handleAddToCart}
              >
                {isAlreadyInCart ? "Added to cart" : "Add to cart"}
              </Button>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
