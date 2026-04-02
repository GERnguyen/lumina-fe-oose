import Button from "./ui/Button";
import { cn } from "../utils/cn";

export interface CourseProgressCardProps {
  imageUrl: string;
  courseTitle: string;
  currentLecture: string;
  progressPercentage: number;
}

export default function CourseProgressCard({
  imageUrl,
  courseTitle,
  currentLecture,
  progressPercentage,
}: CourseProgressCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progressPercentage));
  const isNotStarted = safeProgress === 0;
  const isComplete = safeProgress >= 100;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">
      <img
        src={imageUrl}
        alt={courseTitle}
        className="h-52 w-full object-cover"
      />

      <div className="space-y-4 p-4">
        <div className="space-y-1.5">
          <p className="line-clamp-1 text-xs text-gray-500">{courseTitle}</p>
          <h3 className="line-clamp-1 text-sm font-medium text-neutral-800">
            {currentLecture}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            size="sm"
            colorScheme={isNotStarted ? "primary" : "primary"}
            variant={isNotStarted ? "outline" : "solid"}
            className={cn(!isNotStarted && "bg-primary-500 text-white")}
          >
            Watch Lecture
          </Button>

          <p className="text-sm font-medium text-success-600">
            {isComplete ? "Completed" : `${safeProgress}% Completed`}
          </p>
        </div>
      </div>

      <div className="h-1 w-full bg-gray-100">
        <div
          className={cn(
            "h-1",
            isNotStarted ? "bg-transparent" : "bg-primary-500",
          )}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </article>
  );
}
