import { Bell, Search } from "lucide-react";
import { useState } from "react";
import InstructorCourseCard from "../../components/ui/InstructorCourseCard";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";

const mockCourses = [
  {
    id: 1,
    imageUrl: "https://placehold.co/640x420",
    title: "Premiere Pro CC for Beginners: Video Editing in Premiere",
    category: "Developments",
    categoryTone: "secondary" as const,
    price: 24,
    rating: 4.9,
    students: 982941,
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/640x420",
    title: "Learn Python Programming Masterclass",
    category: "Developments",
    categoryTone: "secondary" as const,
    price: 49,
    rating: 4.0,
    students: 511123,
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/640x420",
    title: "Data Structures and Algorithms Essentials",
    category: "Developments",
    categoryTone: "secondary" as const,
    price: 23,
    originalPrice: 35,
    rating: 5.0,
    students: 197637,
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/640x420",
    title: "Complete Blender Creator: Learn 3D Modelling for Beginners",
    category: "Developments",
    categoryTone: "secondary" as const,
    price: 16,
    rating: 3.5,
    students: 435671,
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/640x420",
    title: "SQL for NEWBS: Weekender Crash Course",
    category: "Developments",
    categoryTone: "secondary" as const,
    price: 13,
    rating: 4.7,
    students: 154817,
  },
  {
    id: 6,
    imageUrl: "https://placehold.co/640x420",
    title: "Machine Learning A-Z: Hands-On Python and R In Data Science",
    category: "Developments",
    categoryTone: "secondary" as const,
    price: 89,
    rating: 5.0,
    students: 211434,
  },
];

export default function InstructorMyCourses() {
  const [currentPage, setCurrentPage] = useState(2);

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

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden w-full max-w-xs md:block">
              <Input
                placeholder="Search"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            <button
              type="button"
              className="rounded-lg bg-slate-50 p-3 text-gray-600 transition hover:bg-gray-100 hover:text-neutral-800"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <img
              src="https://placehold.co/48x48"
              alt="Instructor avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Search"
            placeholder="Search in your courses..."
            leftIcon={<Search className="h-4 w-4" />}
          />

          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span className="block text-sm text-gray-500">Sort by</span>
            <select className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-700 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
              <option>Latest</option>
              <option>Oldest</option>
              <option>Most Enrolled</option>
            </select>
          </label>

          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span className="block text-sm text-gray-500">Category</span>
            <select className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-700 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
              <option>All Category</option>
              <option>Development</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
          </label>

          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span className="block text-sm text-gray-500">Rating</span>
            <select className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-base text-gray-700 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
              <option>4 Star and Up</option>
              <option>3 Star and Up</option>
              <option>2 Star and Up</option>
            </select>
          </label>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCourses.map((course) => (
            <InstructorCourseCard
              key={course.id}
              imageUrl={course.imageUrl}
              title={course.title}
              category={course.category}
              categoryTone={course.categoryTone}
              price={course.price}
              originalPrice={course.originalPrice}
              rating={course.rating}
              students={course.students}
            />
          ))}
        </section>

        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 text-sm text-gray-500 lg:flex-row lg:items-center lg:justify-between">
          <p>
            <span>© 2021 - Eduguard. Designed by </span>
            <span className="text-neutral-800">Templatecookie.</span>
            <span> All rights reserved</span>
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="transition hover:text-neutral-800">
              FAQs
            </a>
            <a href="#" className="transition hover:text-neutral-800">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-neutral-800">
              Terms and Condition
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
