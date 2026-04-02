import {
  Calendar,
  ChevronRight,
  Download,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import AttachmentCard from "../../components/AttachmentCard";
import CommentItem from "../../components/CommentItem";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LearningCurriculum from "../../components/LearningCurriculum";
import VideoPlayer from "../../components/VideoPlayer";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  watchCourseAttachments,
  watchCourseComments,
  watchCourseDescription,
  watchCourseMeta,
  watchCourseNotes,
  watchCourseSections,
  type WatchCourseTab,
} from "../../data/watchCourse.mock";
import { cn } from "../../utils/cn";

const tabs: Array<{ key: WatchCourseTab; label: string }> = [
  { key: "description", label: "Description" },
  { key: "notes", label: "Lecture Notes" },
  { key: "attachments", label: "Attach File" },
  { key: "comments", label: "Comments" },
];

export default function WatchCourse() {
  const [activeTab, setActiveTab] = useState<WatchCourseTab>("description");

  const activeTabContent = useMemo(() => {
    if (activeTab === "description") {
      return (
        <section className="space-y-4">
          <h3 className="text-2xl font-semibold text-neutral-800">
            Lectures Description
          </h3>
          <p className="text-sm leading-7 text-gray-600">
            {watchCourseDescription}
          </p>
        </section>
      );
    }

    if (activeTab === "notes") {
      return (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-neutral-800">
              Lecture Notes
            </h3>
            <Button variant="outline" colorScheme="primary" size="sm">
              <Download className="h-4 w-4" />
              Download notes
            </Button>
          </div>

          <div className="space-y-3">
            {watchCourseNotes.map((note) => (
              <p key={note} className="text-sm leading-7 text-gray-600">
                {note}
              </p>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "attachments") {
      return (
        <section className="space-y-5">
          <h3 className="text-2xl font-semibold text-neutral-800">
            Attach Files ({watchCourseAttachments.length})
          </h3>
          <div className="space-y-3">
            {watchCourseAttachments.map((attachment) => (
              <AttachmentCard key={attachment.id} attachment={attachment} />
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="space-y-6">
        <h3 className="text-2xl font-semibold text-neutral-800">
          Comments ({watchCourseMeta.commentsCount})
        </h3>

        <div className="space-y-6">
          {watchCourseComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              placeholder="Write your reply"
              leftIcon={<MessageSquare className="h-4 w-4" />}
            />
            <Button colorScheme="primary" className="w-full sm:w-auto">
              Post reply
            </Button>
          </div>
        </div>
      </section>
    );
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />

      <section className="border-b border-gray-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {watchCourseMeta.breadcrumbs.map((crumb, index) => (
              <div key={crumb} className="flex items-center gap-2">
                <span>{crumb}</span>
                {index < watchCourseMeta.breadcrumbs.length - 1 ? (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                ) : null}
              </div>
            ))}
          </div>

          <h1 className="mt-4 text-xl font-semibold leading-snug text-neutral-800 sm:text-2xl lg:text-3xl">
            {watchCourseMeta.courseTitle}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>Instructor: {watchCourseMeta.instructor}</span>
            <span className="inline-flex items-center gap-1.5 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="font-medium">
                {watchCourseMeta.rating.toFixed(1)}
              </span>
            </span>
            <span>{watchCourseMeta.studentsWatching} students watching</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <section className="space-y-6 lg:col-span-2 xl:col-span-3">
            <VideoPlayer
              posterSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop"
              title={watchCourseMeta.lessonTitle}
            />

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-neutral-800 sm:text-2xl">
                {watchCourseMeta.lessonTitle}
              </h2>

              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Last updated: {watchCourseMeta.updatedAt}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Comments: {watchCourseMeta.commentsCount}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Duration: {watchCourseMeta.lessonDuration} /{" "}
                  {watchCourseMeta.totalDuration}
                </span>
              </div>
            </div>

            <section className="rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-4 sm:px-6">
                <nav className="flex items-center gap-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium transition",
                        activeTab === tab.key
                          ? "border-primary-500 text-neutral-800"
                          : "border-transparent text-gray-600 hover:text-neutral-800",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="px-4 py-6 sm:px-6">{activeTabContent}</div>
            </section>
          </section>

          <aside className="space-y-4 lg:col-span-1">
            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold text-neutral-800">
                  Course Contents
                </h3>
                <span className="text-sm font-semibold text-green-600">
                  {watchCourseMeta.progressPercent}% Completed
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: `${watchCourseMeta.progressPercent}%` }}
                />
              </div>
            </div>

            <LearningCurriculum sections={watchCourseSections} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
