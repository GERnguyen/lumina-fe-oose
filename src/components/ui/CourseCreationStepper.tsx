import { BookOpen, Check, Layers3, Send } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn";

const steps = [
  {
    label: "Basic Information",
    to: "/instructor/create-course/basic",
    icon: BookOpen,
  },
  {
    label: "Advance Information",
    to: "/instructor/create-course/advance",
    icon: Layers3,
  },
  {
    label: "Curriculum",
    to: "/instructor/create-course/curriculum",
    icon: Send,
  },
  {
    label: "Publish Course",
    to: "/instructor/create-course/publish",
    icon: Send,
  },
];

export default function CourseCreationStepper() {
  const location = useLocation();
  const currentIndex = steps.findIndex((step) =>
    location.pathname.startsWith(step.to),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <nav className="flex min-w-max items-stretch gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentIndex > index;

          return (
            <NavLink
              key={step.to}
              to={step.to}
              className={({ isActive }) =>
                cn(
                  "flex min-w-80 items-center justify-between px-5 py-4 text-left transition",
                  isActive
                    ? "text-neutral-800 shadow-[inset_0px_-2px_0px_0px_rgba(255,102,54,1.00)]"
                    : "text-gray-500",
                )
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center",
                    isCompleted ? "text-green-600" : "text-current",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </span>
                <span className="text-base font-medium">{step.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
