import {
  Briefcase,
  Dumbbell,
  GraduationCap,
  type LucideIcon,
  Monitor,
  Palette,
  PlayCircle,
} from "lucide-react";
import { useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import CourseCard from "../components/CourseCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import {
  useCategories,
  useBestSellers,
  useTopDiscounted,
  useCart,
} from "../hooks/queries";
import { useAuth } from "../hooks/useAuth";
import type { Course } from "../types/course";

const categoryCardIcons: LucideIcon[] = [
  Monitor,
  Briefcase,
  Palette,
  Dumbbell,
  GraduationCap,
  PlayCircle,
];

const categoryCardTones: Array<
  "primary" | "secondary" | "success" | "warning" | "danger" | "gray"
> = ["secondary", "success", "warning", "primary", "danger", "gray"];

// Loading skeleton component
function CourseSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-40 rounded-lg bg-gray-200" />
      <div className="mb-2 h-4 rounded bg-gray-200" />
      <div className="h-3 w-3/4 rounded bg-gray-200" />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-neutral-800 sm:text-5xl lg:text-6xl">
            Learn with experts anytime, anywhere
          </h1>
          <p className="max-w-xl text-lg text-gray-600">
            Our mission is to help people find the best online course and learn
            practical skills to grow their careers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/sign-in">
              <Button colorScheme="primary" size="lg">
                Create account
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="outline" colorScheme="gray" size="lg">
                Explore courses
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1400&auto=format&fit=crop"
            alt="Students learning online"
            className="h-[420px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function SponsorsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"></div>
    </section>
  );
}

function TopCategoriesSection() {
  const { data: categoriesData, isLoading } = useCategories();
  const topCategories = useMemo(
    () =>
      [...(categoriesData ?? [])]
        .sort((left, right) => {
          const leftCount = left.courseCount ?? 0;
          const rightCount = right.courseCount ?? 0;
          return rightCount - leftCount;
        })
        .slice(0, 6),
    [categoriesData],
  );

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-semibold text-neutral-800">
            Browse top category
          </h2>
          <p className="text-sm text-gray-600">
            Explore in-demand topics and start learning fast.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 rounded-lg bg-gray-200" />
                </div>
              ))
            : topCategories.map((category, index) => {
                const icon =
                  categoryCardIcons[index % categoryCardIcons.length];
                const tone =
                  categoryCardTones[index % categoryCardTones.length];

                return (
                  <Link
                    key={category.id}
                    to={`/courses?categoryId=${category.id}`}
                    className="block outline-none transition focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <CategoryCard
                      icon={icon}
                      name={category.name}
                      courseCount={category.courseCount ?? 0}
                      tone={tone}
                    />
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}

function FeaturedCoursesSection() {
  const { data: bestSellers, isLoading: isLoadingBestSellers } =
    useBestSellers();
  const { data: topDiscounted, isLoading: isLoadingTopDiscounted } =
    useTopDiscounted();
  const { isAuthenticated } = useAuth();
  const { data: cartData } = useCart(isAuthenticated);
  const cartCourseIds = useMemo(
    () => (cartData?.items ?? []).map((item) => item.courseId),
    [cartData],
  );

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-semibold text-neutral-800">
            Khóa học bán chạy
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingBestSellers
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CourseSkeleton key={`best-loading-${i}`} />
                ))
              : (bestSellers ?? []).slice(0, 4).map((course: Course) => (
                  <div key={course.id} className="block h-full">
                    <CourseCard
                      course={course}
                      categoryTone="secondary"
                      cartCourseIds={cartCourseIds}
                    />
                  </div>
                ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-semibold text-neutral-800">
            Khóa học đang giảm giá
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingTopDiscounted
              ? Array.from({ length: 4 }).map((_, i) => (
                  <CourseSkeleton key={`discount-loading-${i}`} />
                ))
              : (topDiscounted ?? []).slice(0, 4).map((course: Course) => (
                  <div key={course.id} className="block h-full">
                    <CourseCard
                      course={course}
                      categoryTone="warning"
                      cartCourseIds={cartCourseIds}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstructorCTASection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"></div>
    </section>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />
      <main>
        <HeroSection />
        <SponsorsSection />
        <TopCategoriesSection />
        <FeaturedCoursesSection />
        <InstructorCTASection />
      </main>
      <Footer />
    </div>
  );
}
