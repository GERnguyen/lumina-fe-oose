import { Upload } from "lucide-react";
import type { ReactNode } from "react";
import Button from "./ui/Button";

interface UploadBoxProps {
  title: string;
  helperText: string;
  buttonLabel: string;
  icon?: ReactNode;
}

export default function UploadBox({
  title,
  helperText,
  buttonLabel,
  icon,
}: UploadBoxProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex aspect-square w-32 items-center justify-center rounded-lg bg-slate-50 text-stone-300">
          {icon ?? <Upload className="h-10 w-10" />}
        </div>

        <div className="space-y-4">
          <p className="max-w-md text-sm leading-6 text-gray-500">
            {helperText}
          </p>
          <Button variant="outline" colorScheme="primary">
            {buttonLabel}
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
