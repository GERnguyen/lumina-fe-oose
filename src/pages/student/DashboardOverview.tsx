import { ArrowLeft, ArrowRight } from "lucide-react";
import CourseProgressCard from "../../components/CourseProgressCard";
import StatCard from "../../components/StatCard";
import {
  studentLearningCourses,
  studentStats,
} from "../../data/studentDashboard.mock";

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-neutral-800">Dashboard</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {studentStats.map((stat) => (
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
            Let&apos;s start learning, Kevin
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-500 transition hover:bg-primary-200"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-500 transition hover:bg-primary-200"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {studentLearningCourses.map((course) => (
            <CourseProgressCard key={course.currentLecture} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
