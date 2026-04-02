import { X } from "lucide-react";

interface InstructorBadgeProps {
  avatarUrl: string;
  username: string;
  role: string;
}

export default function InstructorBadge({
  avatarUrl,
  username,
  role,
}: InstructorBadgeProps) {
  return (
    <article className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
      <img
        src={avatarUrl}
        alt={username}
        className="h-12 w-12 rounded-full object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-800">
          {username}
        </p>
        <p className="truncate text-sm text-gray-500">{role}</p>
      </div>

      <button
        type="button"
        className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-neutral-800"
        aria-label={`Remove ${username}`}
      >
        <X className="h-4 w-4" />
      </button>
    </article>
  );
}
