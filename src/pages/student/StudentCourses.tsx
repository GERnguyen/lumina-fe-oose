import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import CourseProgressCard, {
  type CourseProgressCardProps,
} from "../../components/CourseProgressCard";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";
import { useMyLearningCourses } from "../../hooks/queries";

interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  return (
    <label className="w-full space-y-2">
      <span className="text-xs font-normal text-gray-500">{label}</span>
      <div className="relative">
        <select
          className="h-12 w-full appearance-none rounded-lg bg-white px-4 pr-10 text-base text-gray-600 outline outline-1 outline-gray-200 outline-offset-[-1px] transition focus:outline-2 focus:outline-primary-500"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-800" />
      </div>
    </label>
  );
}

export default function StudentCourses() {
  const {
    data: learningCourses = [],
    isLoading,
    isError,
  } = useMyLearningCourses();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [statusFilter, setStatusFilter] = useState("All Courses");
  const [progressFilter, setProgressFilter] = useState("All");
  const pageSize = 8;

  const mappedCourses = useMemo<CourseProgressCardProps[]>(
    () =>
      learningCourses.map((course) => ({
        courseId: course.courseId,
        imageUrl: course.image ?? "https://placehold.co/600x400",
        courseTitle: course.title,
        currentLecture: "Continue learning",
        progressPercentage: Number(course.progressPercentage) || 0,
      })),
    [learningCourses],
  );

  const filteredCourses = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    const bySearch = mappedCourses.filter((course) =>
      course.courseTitle.toLowerCase().includes(keyword),
    );

    const byStatus = bySearch.filter((course) => {
      if (statusFilter === "In Progress") {
        return course.progressPercentage > 0 && course.progressPercentage < 100;
      }

      if (statusFilter === "Not Started") {
        return course.progressPercentage === 0;
      }

      if (statusFilter === "Completed") {
        return course.progressPercentage >= 100;
      }

      return true;
    });

    const byProgress = byStatus.filter((course) => {
      if (progressFilter === "0-25%") {
        return (
          course.progressPercentage >= 0 && course.progressPercentage <= 25
        );
      }

      if (progressFilter === "26-75%") {
        return (
          course.progressPercentage >= 26 && course.progressPercentage <= 75
        );
      }

      if (progressFilter === "76-100%") {
        return course.progressPercentage >= 76;
      }

      return true;
    });

    const sorted = [...byProgress];
    if (sortBy === "A-Z") {
      sorted.sort((left, right) =>
        left.courseTitle.localeCompare(right.courseTitle),
      );
    } else if (sortBy === "Progress") {
      sorted.sort(
        (left, right) => right.progressPercentage - left.progressPercentage,
      );
    }

    return sorted;
  }, [mappedCourses, progressFilter, searchValue, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const paginatedCourses = useMemo(
    () =>
      filteredCourses.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [currentPage, filteredCourses],
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleProgressChange = (value: string) => {
    setProgressFilter(value);
    setCurrentPage(1);
  };

  return (
    <section className="space-y-8">
      <h2 className="text-3xl leading-8 text-neutral-800">
        <span className="font-semibold">Courses </span>
        <span className="font-normal">({filteredCourses.length})</span>
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-end lg:gap-6">
        <div className="w-full space-y-2">
          <p className="text-xs font-normal text-gray-500">Search:</p>
          <Input
            placeholder="Search in your courses..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchValue}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
        </div>

        <SelectField
          label="Sort by:"
          options={["Latest", "A-Z", "Progress"]}
          value={sortBy}
          onChange={handleSortChange}
        />
        <SelectField
          label="Status:"
          options={["All Courses", "In Progress", "Not Started", "Completed"]}
          value={statusFilter}
          onChange={handleStatusChange}
        />
        <SelectField
          label="Progress:"
          options={["All", "0-25%", "26-75%", "76-100%"]}
          value={progressFilter}
          onChange={handleProgressChange}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-5 text-danger-700">
          Unable to load your courses.
        </div>
      ) : paginatedCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-600">
          No courses matched your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {paginatedCourses.map((course) => (
            <CourseProgressCard
              key={`${course.courseTitle}-${course.imageUrl}`}
              {...course}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
