import { type ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";

export interface FilterAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function FilterAccordion({
  title,
  children,
  defaultOpen = true,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between border-b border-gray-200 px-5 py-4"
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-neutral-800">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-neutral-800 transition-transform",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {isOpen ? <div className="space-y-3 px-5 py-4">{children}</div> : null}
    </section>
  );
}
