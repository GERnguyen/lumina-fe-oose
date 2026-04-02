import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";

export type LearningContentType = "lecture" | "quiz";

export interface LearningCurriculumItem {
  id: number;
  type: LearningContentType;
  title: string;
  orderIndex: number;
  completed?: boolean;
}

export interface LearningCurriculumSection {
  id: number;
  title: string;
  lectureCount: number;
  quizCount: number;
  totalDuration?: string;
  progressText?: string;
  locked?: boolean;
  items: LearningCurriculumItem[];
}

interface LearningCurriculumProps {
  sections: LearningCurriculumSection[];
  activeType?: LearningContentType;
  activeId?: number;
  onSelectItem: (item: LearningCurriculumItem) => void;
}

export default function LearningCurriculum({
  sections,
  activeType,
  activeId,
  onSelectItem,
}: LearningCurriculumProps) {
  const [openSectionIds, setOpenSectionIds] = useState<string[]>(
    sections.length > 0 ? [String(sections[0].id)] : [],
  );

  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.items.some(
        (item) =>
          item.type === activeType && Number(item.id) === Number(activeId),
      ),
    );

    if (!activeSection) {
      return;
    }

    const activeSectionId = String(activeSection.id);
    setOpenSectionIds((current) =>
      current.includes(activeSectionId)
        ? current
        : [...current, activeSectionId],
    );
  }, [activeId, activeType, sections]);

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
        const sectionId = String(section.id);
        const isOpen = openSectionIds.includes(sectionId);
        const isSectionLocked = Boolean(section.locked);

        return (
          <div
            key={sectionId}
            className={cn(sectionIndex !== 0 && "border-t border-gray-200")}
          >
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-between gap-4 px-4 py-4 text-left",
                isOpen ? "bg-slate-50" : "bg-white",
                isSectionLocked && "cursor-not-allowed opacity-70",
              )}
              onClick={() => {
                if (isSectionLocked) {
                  return;
                }
                toggleSection(sectionId);
              }}
              disabled={isSectionLocked}
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
                  <span>{section.quizCount} quizzes</span>
                  {section.totalDuration ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {section.totalDuration}
                    </span>
                  ) : null}
                  {section.progressText ? (
                    <span className="text-green-600">
                      {section.progressText}
                    </span>
                  ) : null}
                </div>
              </div>

              {isSectionLocked ? (
                <Lock className="h-5 w-5 shrink-0 text-gray-500" />
              ) : (
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-gray-500 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </button>

            {isOpen ? (
              <div className="px-2 py-2">
                {section.items.map((item) => {
                  const ItemIcon =
                    item.type === "lecture" ? FileText : HelpCircle;
                  const isActiveItem =
                    item.type === activeType &&
                    Number(item.id) === Number(activeId);

                  return (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => onSelectItem(item)}
                      disabled={isSectionLocked}
                      className={cn(
                        "mb-1 flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left",
                        isActiveItem ? "bg-orange-50" : "hover:bg-gray-50",
                        isSectionLocked && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <span
                            className={cn(
                              "h-4 w-4 shrink-0 rounded-full border",
                              isActiveItem
                                ? "border-primary-500"
                                : "border-gray-300",
                            )}
                            aria-hidden="true"
                          />
                        )}

                        <ItemIcon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActiveItem ? "text-neutral-800" : "text-gray-400",
                          )}
                        />

                        <span
                          className={cn(
                            "truncate text-sm",
                            isActiveItem
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
                          isActiveItem ? "text-neutral-800" : "text-gray-400",
                        )}
                      >
                        {item.type === "lecture" ? "Lecture" : "Quiz"}{" "}
                        {item.orderIndex}
                      </span>
                    </button>
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
