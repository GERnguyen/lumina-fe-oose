import { Navigate, Outlet, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import CourseCreationStepper from "../components/ui/CourseCreationStepper";

const titles: Record<string, string> = {
  basic: "Basic Information",
  advance: "Advance Information",
  curriculum: "Course Curriculum",
  publish: "Publish Course",
};

export default function CreateCourseLayout() {
  const location = useLocation();
  const currentStep = location.pathname.split("/").pop() ?? "basic";

  if (location.pathname === "/instructor/create-course") {
    return <Navigate to="basic" replace />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm sm:px-6 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-2xl font-semibold text-neutral-800">
          {titles[currentStep] ?? titles.basic}
        </h2>

        <div className="mt-4 flex flex-wrap gap-3 lg:mt-0">
          <Button variant="outline" colorScheme="primary">
            Save
          </Button>
          <Button colorScheme="primary">Save &amp; Preview</Button>
        </div>
      </section>

      <CourseCreationStepper />

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
