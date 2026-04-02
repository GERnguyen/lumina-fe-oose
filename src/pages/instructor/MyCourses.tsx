import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import InstructorCourseCard from "../../components/ui/InstructorCourseCard";
import Pagination from "../../components/ui/Pagination";
import courseService from "../../services/course.service";

const PAGE_SIZE = 6;

export default function InstructorMyCourses() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const coursesQuery = useQuery({
    queryKey: ["instructor", "my-courses"],
    queryFn: () => courseService.getMyInstructorCourses(),
  });

  const allCourses = coursesQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(allCourses.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  const visibleCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return allCourses.slice(startIndex, startIndex + PAGE_SIZE);
  }, [allCourses, currentPage]);

  return (
    <div className="flex w-full flex-col">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-gray-500">Good Morning</p>
            <h1 className="text-2xl font-semibold text-neutral-800">
              My Courses
            </h1>
          </div>
        </div>
      </header>

      <main className="space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => (
            <InstructorCourseCard
              key={course.id}
              courseId={course.id}
              imageUrl={course.thumbnail_url || "https://placehold.co/640x420"}
              title={course.title}
              category={course.category?.name || "Uncategorized"}
              categoryTone="secondary"
              price={course.price}
              rating={course.average_rating}
              students={course.enrollment_count}
              onManageCourse={(courseId) =>
                navigate(`/instructor/courses/${courseId}/manage`)
              }
            />
          ))}
        </section>

        {!coursesQuery.isLoading &&
        !coursesQuery.isError &&
        allCourses.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            Bạn chưa có khóa học nào.
          </p>
        ) : null}

        {coursesQuery.isLoading ? (
          <p className="text-center text-sm text-gray-500">
            Loading courses...
          </p>
        ) : null}

        {coursesQuery.isError ? (
          <p className="text-center text-sm text-danger-600">
            Failed to load your courses.
          </p>
        ) : null}

        {allCourses.length > PAGE_SIZE ? (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
