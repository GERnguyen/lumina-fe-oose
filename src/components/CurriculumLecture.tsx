import {
  Captions,
  ChevronDown,
  Edit3,
  FileText,
  Menu,
  Paperclip,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
import Button from "./ui/Button";

const contentItems = [
  { label: "Video", icon: Video },
  { label: "Attach File", icon: Paperclip },
  { label: "Captions", icon: Captions },
  { label: "Description", icon: FileText },
  { label: "Lecture Notes", icon: FileText },
];

interface CurriculumLectureProps {
  title: string;
}

export default function CurriculumLecture({ title }: CurriculumLectureProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg bg-white px-5 py-3 shadow-sm ring-1 ring-gray-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-neutral-800">{title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Button
              variant="outline"
              colorScheme="primary"
              size="sm"
              onClick={() => setIsOpen((current) => !current)}
            >
              contents
              <ChevronDown className="h-4 w-4" />
            </Button>

            {isOpen ? (
              <div className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {contentItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-600 transition hover:bg-slate-50 hover:text-neutral-800"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

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
    </div>
  );
}
