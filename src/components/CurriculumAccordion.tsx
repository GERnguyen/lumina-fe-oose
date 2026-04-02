import { ChevronDown, FileText, PlayCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import type { CourseSection } from "../types/course";
import { cn } from "../utils/cn";

export interface CurriculumAccordionProps {
  section: CourseSection;
  defaultOpen?: boolean;
}

export default function CurriculumAccordion({
  section,
  defaultOpen = false,
}: CurriculumAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-base font-semibold text-neutral-800">
            {section.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {(section.lectures?.length ?? 0) + (section.quizzes?.length ?? 0)}{" "}
            items
          </p>
        </div>

        <ChevronDown
          className={cn(
            "h-5 w-5 text-neutral-800 transition-transform",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {isOpen ? (
        <div className="border-t border-gray-200 px-5 py-4">
          <div className="space-y-3">
            {(section.lectures ?? []).map((lecture) => {
              const Icon = lecture.videoUrl ? PlayCircle : FileText;

              return (
                <div
                  key={lecture.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-lg px-3 py-2 transition",
                    "bg-white hover:bg-gray-50",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-gray-400" />
                    <span className="truncate text-sm font-normal text-gray-600">
                      {lecture.title}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-normal text-gray-400">
                    Lecture {lecture.orderIndex}
                  </span>
                </div>
              );
            })}

            {(section.quizzes ?? []).map((quiz) => (
              <div
                key={quiz.id}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-lg px-3 py-2 transition",
                  "bg-white hover:bg-gray-50",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <HelpCircle className="h-5 w-5 shrink-0 text-gray-400" />
                  <span className="truncate text-sm font-normal text-gray-600">
                    {quiz.title}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-normal text-gray-400">
                  Quiz {quiz.orderIndex}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
