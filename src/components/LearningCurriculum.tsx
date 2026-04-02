import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import type { LearningSectionItem } from "../data/watchCourse.mock";
import { cn } from "../utils/cn";

interface LearningCurriculumProps {
  sections: LearningSectionItem[];
}

export default function LearningCurriculum({
  sections,
}: LearningCurriculumProps) {
  const [openSectionIds, setOpenSectionIds] = useState<string[]>(
    sections.length > 0 ? [sections[0].id] : [],
  );

  const toggleSection = (sectionId: string) => {
    setOpenSectionIds((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {sections.map((section, sectionIndex) => {
        const isOpen = openSectionIds.includes(section.id);

        return (
          <div
            key={section.id}
            className={cn(sectionIndex !== 0 && "border-t border-gray-200")}
          >
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between gap-4 px-4 py-4 text-left",
                isOpen ? "bg-slate-50" : "bg-white",
              )}
              onClick={() => toggleSection(section.id)}
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-base font-medium",
                    isOpen ? "text-primary-500" : "text-neutral-800",
                  )}
                >
                  {section.title}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span>{section.lectureCount} lectures</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" />
                    {section.totalDuration}
                  </span>
                  {section.progressText ? (
                    <span className="text-green-600">
                      {section.progressText}
                    </span>
                  ) : null}
                </div>
              </div>

              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-gray-500 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen ? (
              <div className="px-2 py-2">
                {section.items.map((item) => {
                  const ItemIcon = item.isFile ? FileText : PlayCircle;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "mb-1 flex items-center justify-between gap-3 rounded-lg px-3 py-2",
                        item.active ? "bg-orange-50" : "hover:bg-gray-50",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <span
                            className={cn(
                              "h-4 w-4 shrink-0 rounded-full border",
                              item.active
                                ? "border-primary-500"
                                : "border-gray-300",
                            )}
                            aria-hidden="true"
                          />
                        )}

                        <ItemIcon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            item.active ? "text-neutral-800" : "text-gray-400",
                          )}
                        />

                        <span
                          className={cn(
                            "truncate text-sm",
                            item.active
                              ? "font-medium text-neutral-800"
                              : "font-normal text-gray-600",
                          )}
                        >
                          {item.title}
                        </span>
                      </div>

                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          item.active ? "text-neutral-800" : "text-gray-400",
                        )}
                      >
                        {item.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
