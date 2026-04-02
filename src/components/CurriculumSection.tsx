import { Edit3, Menu, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import Button from "./ui/Button";

interface CurriculumSectionProps {
  title: string;
  children: ReactNode;
}

export default function CurriculumSection({
  title,
  children,
}: CurriculumSectionProps) {
  return (
    <section className="rounded-xl bg-slate-50">
      <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-gray-500" />
          <h3 className="text-base font-medium text-neutral-800">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            colorScheme="gray"
            className="h-9 px-3 text-gray-500"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            colorScheme="gray"
            className="h-9 px-3 text-gray-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </section>
  );
}
