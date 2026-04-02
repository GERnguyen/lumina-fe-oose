import { ChevronDown, FileText, PlayCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import type { CurriculumSection } from "../data/courseDetail.mock";

export interface CurriculumAccordionProps {
  section: CurriculumSection;
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
            {section.lectures} lectures • {section.duration}
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
            {section.items.map((item) => {
              const Icon = item.isFile ? FileText : PlayCircle;

              return (
                <div
                  key={item.title}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-lg px-3 py-2 transition",
                    item.active ? "bg-primary-50" : "bg-white hover:bg-gray-50",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        item.active ? "text-primary-500" : "text-gray-400",
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm",
                        item.active
                          ? "font-medium text-primary-600"
                          : "font-normal text-gray-600",
                      )}
                    >
                      {item.title}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "shrink-0 text-sm",
                      item.active
                        ? "font-medium text-primary-500"
                        : "font-normal text-gray-400",
                    )}
                  >
                    {item.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
