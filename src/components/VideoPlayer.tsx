import { PlayCircle } from "lucide-react";

interface VideoPlayerProps {
  posterSrc?: string;
  videoSrc?: string;
  title?: string;
}

export default function VideoPlayer({
  posterSrc,
  videoSrc,
  title = "Lesson video",
}: VideoPlayerProps) {
  if (videoSrc) {
    return (
      <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
        <div className="aspect-video w-full">
          <video
            controls
            className="h-full w-full object-cover"
            poster={posterSrc}
            aria-label={title}
          >
            <source src={videoSrc} />
          </video>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
      <div
        className="relative aspect-video w-full bg-cover bg-center"
        style={posterSrc ? { backgroundImage: `url(${posterSrc})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            aria-label={`Play ${title}`}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 text-white backdrop-blur transition hover:bg-white/25"
          >
            <PlayCircle className="h-7 w-7" />
            <span className="text-sm font-medium">Play Lesson</span>
          </button>
        </div>
      </div>
    </div>
  );
}
