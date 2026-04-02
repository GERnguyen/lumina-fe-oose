import { useMemo } from "react";
import { BookOpenCheck, CircleCheck, PlayCircle, Users } from "lucide-react";
import CourseProgressCard from "../../components/CourseProgressCard";
import StatCard from "../../components/StatCard";
import { useMyLearningCourses, useMyOrders } from "../../hooks/queries";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardOverview() {
  const { user } = useAuth();
  const {
    data: learningCourses = [],
    isLoading,
    isError,
  } = useMyLearningCourses();
  const { data: myOrders = [] } = useMyOrders();

  const cards = useMemo(
    () =>
      learningCourses.slice(0, 4).map((course) => ({
        courseId: course.courseId,
        imageUrl: course.image ?? "https://placehold.co/600x400",
        courseTitle: course.title,
        currentLecture: "Continue learning",
        progressPercentage: Number(course.progressPercentage) || 0,
      })),
    [learningCourses],
  );

  const stats = useMemo(() => {
    const enrolledCount = learningCourses.length;
    const activeCount = learningCourses.filter(
      (course) =>
        Number(course.progressPercentage) > 0 &&
        Number(course.progressPercentage) < 100,
    ).length;
    const completedCount = learningCourses.filter(
      (course) => Number(course.progressPercentage) >= 100,
    ).length;

    const instructorIds = new Set<number>();
    myOrders.forEach((order) => {
      order.order_details.forEach((detail) => {
        const instructorId = detail.course.instructor?.id;
        if (typeof instructorId === "number" && instructorId > 0) {
          instructorIds.add(instructorId);
        }
      });
    });

    return [
      {
        icon: BookOpenCheck,
        count: enrolledCount,
        label: "Enrolled Courses",
        theme: "primary" as const,
      },
      {
        icon: PlayCircle,
        count: activeCount,
        label: "Active Courses",
        theme: "secondary" as const,
      },
      {
        icon: CircleCheck,
        count: completedCount,
        label: "Completed Courses",
        theme: "success" as const,
      },
      {
        icon: Users,
        count: instructorIds.size,
        label: "Course Instructors",
        theme: "warning" as const,
      },
    ];
  }, [learningCourses, myOrders]);

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-neutral-800">Dashboard</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              count={stat.count}
              label={stat.label}
              theme={stat.theme}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold text-neutral-800">
            Let&apos;s start learning,{" "}
            {user?.profile?.fullName ?? user?.fullName ?? "Student"}
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-5 text-danger-700">
            Unable to load your learning courses right now.
          </div>
        ) : cards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-600">
            You have not enrolled in any course yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((course) => (
              <CourseProgressCard
                key={`${course.courseTitle}-${course.imageUrl}`}
                {...course}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
