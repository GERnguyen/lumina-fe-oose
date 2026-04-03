import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronRight, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import Alert, { type AlertVariant } from "../components/ui/Alert";
import CurriculumAccordion from "../components/CurriculumAccordion";
import ReviewCard from "../components/ReviewCard";
import { useCourseDetail, useMyLearningCourses } from "../hooks/queries";
import { useAddToCart } from "../hooks/queries/useAddToCart";
import { formatCurrencyVnd, getDiscountedPrice } from "../utils/price.ts";
import { courseIncludes } from "../data/courseDetail.mock";
import reviewService from "../services/review.service";
import { useAuth } from "../hooks/useAuth";
import type { CourseReview, CourseSection } from "../types/course";

interface ToastState {
  variant: AlertVariant;
  message: string;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data
  ) {
    const message = (error.response as { data?: { message?: unknown } }).data
      ?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function CourseSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-96 rounded-lg bg-gray-200" />
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
    </div>
  );
}

export default function CourseDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id, courseId } = useParams<{ id?: string; courseId?: string }>();
  const resolvedCourseId = id ?? courseId;
  const { user, isAuthenticated } = useAuth();
  const addToCartMutation = useAddToCart();
  const { data: myLearningCourses = [] } =
    useMyLearningCourses(isAuthenticated);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const {
    data,
    isLoading: isLoadingCourse,
    isError: isCourseError,
  } = useCourseDetail(resolvedCourseId);

  const course = data?.course;
  const reviews: CourseReview[] = data?.reviews ?? [];
  const curriculumSections: CourseSection[] = course?.sections ?? [];
  const isLoadingReviews = isLoadingCourse;

  const submitReviewMutation = useMutation({
    mutationFn: (payload: {
      courseId: number;
      rating: number;
      comment: string;
    }) => reviewService.submitReview(payload),
    onSuccess: async () => {
      setToast({
        variant: "success",
        message: "Đánh giá thành công.",
      });
      setReviewComment("");

      await queryClient.invalidateQueries({
        queryKey: ["course-detail", resolvedCourseId],
      });
    },
    onError: (error) => {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Không thể gửi đánh giá."),
      });
    },
  });

  if (!resolvedCourseId) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-700">
            Course ID is missing from URL.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoadingCourse) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16">
          <CourseSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (isCourseError || !course) {
    return (
      <div className="min-h-screen bg-white font-sans text-neutral-800">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-center text-danger-700">
            Unable to load course detail. Please try again.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const numericCourseId = Number(course.id);
  const isEnrolled = myLearningCourses.some(
    (learningCourse) => learningCourse.courseId === numericCourseId,
  );
  const hasReviewed = user?.id
    ? reviews.some((review) => review.user?.id === user.id)
    : false;

  const handleAddToCart = async () => {
    if (!course.id || addToCartMutation.isPending) {
      return;
    }

    try {
      await addToCartMutation.mutateAsync(course.id);
      setToast({
        variant: "success",
        message: "Đã thêm khóa học vào giỏ hàng.",
      });
    } catch (error) {
      setToast({
        variant: "error",
        message: extractErrorMessage(error, "Không thể thêm vào giỏ hàng."),
      });
    }
  };

  const handleSubmitReview = async () => {
    if (
      !course.id ||
      !isEnrolled ||
      hasReviewed ||
      submitReviewMutation.isPending
    ) {
      return;
    }

    await submitReviewMutation.mutateAsync({
      courseId: Number(course.id),
      rating: selectedRating,
      comment: reviewComment.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      {toast ? (
        <div className="fixed right-4 top-4 z-50 w-[min(92vw,420px)]">
          <Alert
            variant={toast.variant}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      ) : null}

      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>{course.category.name || "Other"}</span>
              <ChevronRight className="h-4 w-4" />
              <span>{course.title}</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
              {/* Main Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h1 className="text-5xl font-semibold text-neutral-800">
                    {course.title}
                  </h1>
                  <p className="text-lg text-gray-600">{course.description}</p>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center gap-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={
                      course.instructor.profile.avatar ||
                      "https://placehold.co/50x50"
                    }
                    alt={course.instructor.profile.fullName || "Instructor"}
                  />
                  <div>
                    <p className="text-sm text-gray-500">Instructor:</p>
                    <p className="font-medium text-neutral-800">
                      {course.instructor.profile.fullName || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.round(course.average_rating)
                            ? "fill-warning-500 text-warning-500"
                            : "fill-gray-200 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-neutral-800">
                      {course.average_rating || 0}
                    </span>{" "}
                    ({course.review_count || 0} reviews) •{" "}
                    {course.enrollment_count || 0} học viên
                  </span>
                </div>
              </div>

              {/* Sidebar */}
              <div className="h-full rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
                <img
                  src={course.thumbnail_url || "https://placehold.co/300x200"}
                  alt={course.title}
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-neutral-800">
                      {formatCurrencyVnd(
                        getDiscountedPrice(
                          course.price,
                          course.discount_percent,
                        ),
                      )}
                    </p>
                    {course.discount_percent > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="line-through">
                          {formatCurrencyVnd(course.price)}
                        </span>
                        <span className="ml-2 text-warning-600 font-semibold">
                          {course.discount_percent}% off
                        </span>
                      </p>
                    )}
                  </div>
                  {isEnrolled ? (
                    <Button
                      className="w-full"
                      colorScheme="primary"
                      onClick={() => navigate(`/learning/course/${course.id}`)}
                    >
                      Continue learning
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      colorScheme="primary"
                      isLoading={addToCartMutation.isPending}
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-8 lg:col-span-2">
              {/* What You'll Learn */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-800">
                  What you'll learn
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {courseIncludes.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-800">
                  About this course
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Curriculum */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-800">
                  Course Curriculum
                </h2>
                {curriculumSections.length > 0 ? (
                  <div className="space-y-3">
                    {curriculumSections.map((section, index) => (
                      <CurriculumAccordion
                        key={section.id}
                        section={section}
                        defaultOpen={index === 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600">
                    Curriculum is not available yet for this course.
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-neutral-800">
                  Student Reviews
                </h2>

                {isEnrolled ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <h3 className="text-lg font-semibold text-neutral-800">
                      Viết đánh giá của bạn
                    </h3>

                    {hasReviewed ? (
                      <p className="mt-3 text-sm text-success-700">
                        Bạn đã đánh giá khóa học này rồi.
                      </p>
                    ) : (
                      <>
                        <div className="mt-3 flex items-center gap-2">
                          {Array.from({ length: 5 }, (_, index) => {
                            const current = index + 1;
                            return (
                              <button
                                key={`rating-${current}`}
                                type="button"
                                onClick={() => setSelectedRating(current)}
                                className="rounded p-1"
                                aria-label={`Rate ${current} star`}
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    current <= selectedRating
                                      ? "fill-warning-500 text-warning-500"
                                      : "fill-gray-200 text-gray-300"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>

                        <textarea
                          value={reviewComment}
                          onChange={(event) =>
                            setReviewComment(event.target.value)
                          }
                          placeholder="Chia sẻ trải nghiệm của bạn về khóa học"
                          className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-primary-500"
                          rows={4}
                        />

                        <Button
                          className="mt-4"
                          colorScheme="primary"
                          isLoading={submitReviewMutation.isPending}
                          onClick={handleSubmitReview}
                        >
                          Gửi đánh giá
                        </Button>
                      </>
                    )}
                  </div>
                ) : null}

                {isLoadingReviews ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 rounded bg-gray-200 mb-2" />
                        <div className="h-4 bg-gray-200 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.slice(0, 5).map((review) => (
                        <ReviewCard
                          key={`${review.id}`}
                          review={{
                            name: review.user.profile.fullName || "Anonymous",
                            avatarUrl:
                              review.user.profile.avatar ||
                              "https://placehold.co/40x40",
                            rating: review.rating,
                            time: new Date(
                              review.createdAt,
                            ).toLocaleDateString(),
                            comment: review.comment || "No comment provided",
                            instructorReply: review.instructorReply,
                            instructorReplyTime: review.instructorRepliedAt
                              ? new Date(
                                  review.instructorRepliedAt,
                                ).toLocaleString()
                              : undefined,
                          }}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600">
                        No student reviews yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  Course Info
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium text-neutral-800">
                      {course.category.name || "Other"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Level</p>
                    <p className="font-medium text-neutral-800">All Levels</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Students</p>
                    <p className="font-medium text-neutral-800">
                      {course.enrollment_count || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="font-medium text-neutral-800">
                      {course.average_rating || 0} / 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
