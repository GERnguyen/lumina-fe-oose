import { useState } from "react";
import type { ChangeEvent } from "react";
import { Filter, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import FilterAccordion from "../components/FilterAccordion";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Input from "../components/ui/Input";
import Pagination from "../components/ui/Pagination";
import { useCourses, useCategories, useCart } from "../hooks/queries";
import { useAuth } from "../hooks/useAuth";
import type { CourseListParams } from "../types/course";
import type { Course } from "../types/course";

function CourseSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-40 rounded-lg bg-gray-200" />
      <div className="mb-2 h-4 rounded bg-gray-200" />
      <div className="h-3 w-3/4 rounded bg-gray-200" />
    </div>
  );
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: cartData } = useCart(isAuthenticated);

  // Extract URL params
  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;
  const sortBy = searchParams.get("sortBy") || "best_seller";

  // Build query params
  const queryParams: CourseListParams = {
    keyword: keyword || undefined,
    categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
    page,
    limit,
    sortBy: sortBy as
      | "best_seller"
      | "newest"
      | "price_asc"
      | "price_desc"
      | "top_rated",
  };

  // Fetch data
  const { data: coursesResponse, isLoading: isLoadingCourses } =
    useCourses(queryParams);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const cartCourseIds = (cartData?.items ?? []).map((item) => item.courseId);

  // Handler functions
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("keyword", e.target.value);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set("categoryId", catId.toString());
    } else {
      newParams.delete("categoryId");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSortChange = (
    sortValue:
      | "best_seller"
      | "newest"
      | "price_asc"
      | "price_desc"
      | "top_rated",
  ) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sortBy", sortValue);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const activeFilterCount = [categoryId ? 1 : 0, keyword ? 1 : 0].reduce(
    (a, b) => a + b,
    0,
  );

  const totalCategoryCourses = (categories ?? []).reduce(
    (sum, category) => sum + (category.courseCount ?? 0),
    0,
  );

  const renderFilterSection = () => (
    <div className="space-y-4">
      <FilterAccordion title="Category">
        <Checkbox
          label="All Categories"
          count={totalCategoryCourses}
          checked={!categoryId}
          onChange={() => handleCategoryChange(null)}
        />
        {isLoadingCategories
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-gray-200" />
            ))
          : categories?.map((cat) => (
              <Checkbox
                key={cat.id}
                label={cat.name}
                count={cat.courseCount ?? 0}
                checked={categoryId === cat.id.toString()}
                onChange={() =>
                  handleCategoryChange(
                    categoryId === cat.id.toString() ? null : cat.id,
                  )
                }
              />
            ))}
      </FilterAccordion>
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
                  </Button>
                </div>

                <div className="w-full max-w-xl">
                  <Input
                    placeholder="Search courses..."
                    value={keyword}
                    onChange={handleSearchChange}
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">Sort by:</p>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    handleSortChange(
                      e.target.value as
                        | "best_seller"
                        | "newest"
                        | "price_asc"
                        | "price_desc"
                        | "top_rated",
                    )
                  }
                  className="inline-flex h-12 items-center justify-between gap-8 rounded-lg border border-gray-200 px-4 text-gray-700"
                >
                  <option value="best_seller">Best Seller</option>
                  <option value="newest">Newest</option>
                  <option value="top_rated">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 md:flex-row md:items-center md:justify-between">
              <p className="text-sm">
                <span className="font-semibold text-neutral-800">
                  {coursesResponse?.total || 0}{" "}
                </span>
                <span className="text-gray-600">
                  results found
                  {keyword ? ` for "${keyword}"` : ""}
                </span>
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <aside className="hidden space-y-4 lg:col-span-1 lg:block">
              {renderFilterSection()}
            </aside>

            <div className="space-y-8 lg:col-span-3">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isLoadingCourses
                  ? Array.from({ length: limit }).map((_, i) => (
                      <CourseSkeleton key={i} />
                    ))
                  : coursesResponse?.data?.map((course: Course) => (
                      <div key={course.id} className="block h-full">
                        <CourseCard
                          course={course}
                          categoryTone="secondary"
                          cartCourseIds={cartCourseIds}
                        />
                      </div>
                    ))}
              </div>

              {coursesResponse && (
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(coursesResponse.total / limit)}
                  onPageChange={handlePageChange}
                />
              )}
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
              {renderFilterSection()}
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
