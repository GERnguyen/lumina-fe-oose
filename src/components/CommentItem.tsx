import { MessageSquare } from "lucide-react";
import type { WatchCourseCommentItem } from "../data/watchCourse.mock";

interface CommentItemProps {
  comment: WatchCourseCommentItem;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <article className="flex items-start gap-3">
      <img
        src={comment.avatarUrl}
        alt={comment.author}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />

      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-neutral-800">
            {comment.author}
          </p>
          {comment.role ? (
            <span className="rounded bg-secondary-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
              {comment.role}
            </span>
          ) : null}
          <span className="text-xs text-gray-500">{comment.timeAgo}</span>
        </div>

        <p className="text-sm leading-6 text-gray-600">{comment.content}</p>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-primary-500"
        >
          <MessageSquare className="h-4 w-4" />
          Reply
        </button>
      </div>
    </article>
  );
}
