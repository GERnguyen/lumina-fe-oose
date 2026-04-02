import { Download, FileText } from "lucide-react";
import type { WatchCourseAttachmentItem } from "../data/watchCourse.mock";
import Button from "./ui/Button";

interface AttachmentCardProps {
  attachment: WatchCourseAttachmentItem;
}

export default function AttachmentCard({ attachment }: AttachmentCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="rounded-lg bg-orange-100 p-3 text-primary-500">
          <FileText className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-medium text-neutral-800">
            {attachment.fileName}
          </p>
          <p className="mt-1 text-sm text-gray-500">{attachment.fileSize}</p>
        </div>
      </div>

      <Button colorScheme="primary" className="w-full sm:w-auto">
        <Download className="h-4 w-4" />
        Download file
      </Button>
    </article>
  );
}
