import { Plus } from "lucide-react";
import Input from "./ui/Input";

interface DynamicInputListProps {
  title: string;
  buttonLabel: string;
  placeholder: string;
  items: string[];
}

export default function DynamicInputList({
  title,
  buttonLabel,
  placeholder,
  items,
}: DynamicInputListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 transition hover:text-primary-600"
        >
          <Plus className="h-4 w-4" />
          {buttonLabel}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <label key={index} className="space-y-1.5">
            <span className="block text-sm font-medium text-neutral-800">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Input placeholder={placeholder} defaultValue={item} />
          </label>
        ))}
      </div>
    </section>
  );
}
