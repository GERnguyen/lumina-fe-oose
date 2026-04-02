import { useState } from "react";
import { ChevronDown, Filter, Search, Star, X } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import FilterAccordion from "../components/FilterAccordion";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Input from "../components/ui/Input";
import Pagination from "../components/ui/Pagination";
import {
  categoryOptions,
  courses,
  durationOptions,
  levelOptions,
  ratingOptions,
  suggestionTags,
  toolOptions,
  type FilterOption,
} from "../data/courses.mock";

type FilterGroup = "category" | "tools" | "rating" | "level" | "duration";

const filterGroupTitles: Record<FilterGroup, string> = {
  category: "Category",
  tools: "Tools",
  rating: "Rating",
  level: "Course Level",
  duration: "Duration",
};

const filterGroups: Record<FilterGroup, FilterOption[]> = {
  category: categoryOptions,
  tools: toolOptions,
  rating: ratingOptions,
  level: levelOptions,
  duration: durationOptions,
};

const initialSelectedFilters: Record<FilterGroup, Record<string, boolean>> = {
  category: Object.fromEntries(
    categoryOptions.map((option) => [option.label, Boolean(option.checked)]),
  ),
  tools: Object.fromEntries(
    toolOptions.map((option) => [option.label, Boolean(option.checked)]),
  ),
  rating: Object.fromEntries(
    ratingOptions.map((option) => [option.label, Boolean(option.checked)]),
  ),
  level: Object.fromEntries(
    levelOptions.map((option) => [option.label, Boolean(option.checked)]),
  ),
  duration: Object.fromEntries(
    durationOptions.map((option) => [option.label, Boolean(option.checked)]),
  ),
};

export default function Courses() {
  const [currentPage, setCurrentPage] = useState(2);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(
    initialSelectedFilters,
  );

  const totalPages = 5;
  const pagedCourses = courses;

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (groupTotal, group) =>
      groupTotal + Object.values(group).filter(Boolean).length,
    0,
  );

  const handleCheckboxChange = (
    group: FilterGroup,
    label: string,
    checked: boolean,
  ) => {
    setSelectedFilters((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [label]: checked,
      },
    }));
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const options = filterGroups[group];

    return (
      <FilterAccordion key={group} title={filterGroupTitles[group]}>
        {options.map((option) => (
          <Checkbox
            key={option.label}
            label={option.label}
            count={option.count}
            checked={selectedFilters[group][option.label]}
            onChange={(checked) =>
              handleCheckboxChange(group, option.label, checked)
            }
          />
        ))}
      </FilterAccordion>
    );
  };

  const filterSections = (
    <div className="space-y-4">
      {renderFilterGroup("category")}
      {renderFilterGroup("tools")}

      <FilterAccordion title="Rating">
        {ratingOptions.map((option) => (
          <div key={option.label} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <Checkbox
                label={option.label}
                count={option.count}
                checked={selectedFilters.rating[option.label]}
                onChange={(checked) =>
                  handleCheckboxChange("rating", option.label, checked)
                }
              />
            </div>
            <Star className="h-4 w-4 fill-warning-500 text-warning-500" />
          </div>
        ))}
      </FilterAccordion>

      {renderFilterGroup("level")}
      {renderFilterGroup("duration")}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />

      <main className="pb-16 pt-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <section className="space-y-4 border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  colorScheme="primary"
                  className="justify-between gap-6 lg:hidden"
                  onClick={() => setIsFilterDrawerOpen(true)}
                >
                  <span className="inline-flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </span>
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-primary-500 px-1.5 text-xs font-semibold text-white">
                    {activeFilterCount}
                  </span>
                </Button>

                <div className="hidden lg:block">
                  <Button
                    variant="outline"
                    colorScheme="primary"
                    className="justify-between gap-6"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </span>
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-primary-500 px-1.5 text-xs font-semibold text-white">
                      {activeFilterCount}
                    </span>
                  </Button>
                </div>

                <div className="w-full max-w-xl">
                  <Input
                    defaultValue="UI/UX Design"
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">Sort by:</p>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-between gap-8 rounded-lg border border-gray-200 px-4 text-gray-700"
                >
                  Trending
                  <ChevronDown className="h-4 w-4 text-neutral-800" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-neutral-800">Suggestion:</span>
                {suggestionTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="text-primary-500 transition hover:text-primary-600"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <p className="text-sm">
                <span className="font-semibold text-neutral-800">
                  3,145,684{" "}
                </span>
                <span className="text-gray-600">
                  results found for "ui/ux design"
                </span>
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="hidden space-y-4 lg:col-span-1 lg:block">
              {filterSections}
            </aside>

            <div className="space-y-8 lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pagedCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="block outline-none transition focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <CourseCard {...course} />
                  </Link>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </div>
      </main>

      {isFilterDrawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters overlay"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-neutral-800">
                  Filters
                </p>
                <p className="text-xs text-gray-500">
                  {activeFilterCount} selected
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              {filterSections}
            </div>

            <div className="border-t border-gray-200 px-4 py-4">
              <Button
                className="w-full"
                colorScheme="primary"
                onClick={() => setIsFilterDrawerOpen(false)}
              >
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
