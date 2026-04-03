import { Star } from "lucide-react";
import type { ReviewItem } from "../data/courseDetail.mock";

export interface ReviewCardProps {
  review: ReviewItem;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="flex gap-4 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
      <img
        src={review.avatarUrl}
        alt={review.name}
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-medium text-neutral-800">
            {review.name}
          </h4>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{review.time}</span>
        </div>

        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }, (_, index) => (
            <Star
              key={index}
              className="h-4 w-4 fill-warning-500 text-warning-500"
            />
          ))}
        </div>

        <p className="text-sm leading-6 text-gray-600">{review.comment}</p>

        {review.instructorReply ? (
          <div className="rounded-lg border border-primary-100 bg-primary-50 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
              Instructor Reply
            </p>
            <p className="mt-1 text-sm leading-6 text-primary-900">
              {review.instructorReply}
            </p>
            {review.instructorReplyTime ? (
              <p className="mt-1 text-xs text-primary-700">
                {review.instructorReplyTime}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
