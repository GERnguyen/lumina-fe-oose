import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Globe,
  Share2,
  Star,
  MessageCircle,
  Music2,
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CurriculumAccordion from "../components/CurriculumAccordion";
import InstructorProfile from "../components/InstructorProfile";
import RatingProgressBar from "../components/RatingProgressBar";
import ReviewCard from "../components/ReviewCard";
import Button from "../components/ui/Button";
import {
  benefitItems,
  courseIncludes,
  courseRequirements,
  courseStats,
  curriculumSections,
  instructor,
  instructorSecond,
  relatedCourses,
  reviews,
  whoThisCourseIsFor,
} from "../data/courseDetail.mock";

const tabItems = ["Overview", "Curriculum", "Instructor", "Review"];

const socialLinks = [
  Globe,
  Share2,
  MessageCircle,
  Music2,
  FileText,
  ArrowRight,
];

const courseBreadcrumbs = ["Home", "Development", "Web Development", "Webflow"];

const ratingBreakdown = [
  { star: 5, percentage: 75, count: 451444 },
  { star: 4, percentage: 21, count: 120044 },
  { star: 3, percentage: 3, count: 18044 },
  { star: 2, percentage: 1, count: 2044 },
  { star: 1, percentage: 1, count: 944 },
];

function HeroHeader() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {courseBreadcrumbs.map((item, index) => (
            <div key={item} className="flex items-center gap-2">
              <span>{item}</span>
              {index < courseBreadcrumbs.length - 1 ? (
                <ChevronRight className="h-4 w-4" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="max-w-5xl text-3xl font-semibold leading-tight text-neutral-800 sm:text-4xl lg:text-5xl">
                Complete Website Responsive Design: from Figma to Webflow to
                Website Design
              </h1>
              <p className="max-w-4xl text-lg leading-8 text-gray-600">
                3 in 1 Course: Learn to design websites with Figma, build with
                Webflow, and make a living freelancing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src="https://placehold.co/50x50"
                  alt="Dianne Russell"
                />
                <img
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                  src="https://placehold.co/50x50"
                  alt="Kristin Watson"
                />
                <div>
                  <p className="text-sm text-gray-500">Created by:</p>
                  <p className="text-base font-medium text-neutral-800">
                    Dianne Russell • Kristin Watson
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className="h-5 w-5 fill-warning-500 text-warning-500"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-neutral-800">4.8</span>
                  <span> (451,444 Rating)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden h-full rounded-2xl bg-white/60 lg:block" />
        </div>
      </div>
    </section>
  );
}

function TabsBar() {
  return (
    <div className="sticky top-0 z-10 -mx-4 border-b border-gray-200 bg-white px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-4 overflow-x-auto py-2">
        {tabItems.map((item, index) => (
          <button
            key={item}
            type="button"
            className={
              index === 0
                ? "border-b-2 border-primary-500 pb-4 text-base font-medium text-neutral-800"
                : "pb-4 text-base font-medium text-gray-600 transition hover:text-neutral-800"
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function SidebarCard() {
  return (
    <aside className="lg:sticky lg:top-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/60">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-neutral-800">
                $14.00
              </span>
              <span className="text-base text-gray-400 line-through">
                $26.00
              </span>
            </div>
            <span className="rounded bg-primary-50 px-3 py-2 text-sm font-medium uppercase text-primary-500">
              56% off
            </span>
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-danger-500">
            <Check className="h-4 w-4" />2 days left at this price!
          </p>
        </div>

        <div className="space-y-4 p-6">
          <Button className="w-full" colorScheme="primary" size="lg">
            Add to Cart
          </Button>
          <Button
            className="w-full"
            variant="outline"
            colorScheme="primary"
            size="lg"
          >
            Buy now
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" colorScheme="gray" size="sm">
              Add to wishlist
            </Button>
            <Button variant="outline" colorScheme="gray" size="sm">
              Gift Course
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-neutral-800">Note:</span> all
            course have 30-days money-back guarantee
          </p>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="text-base font-medium text-neutral-800">
              This course includes:
            </h3>
            <div className="space-y-3">
              {courseStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-500" />
                    <span className="text-neutral-800">{item.label}</span>
                  </div>
                  <span className="text-gray-500">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="text-base font-medium text-neutral-800">
              Course benefits
            </h3>
            <div className="space-y-2">
              {courseIncludes.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <h3 className="text-base font-medium text-neutral-800">
              Share this course:
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" colorScheme="gray" size="sm">
                <Share2 className="h-4 w-4" />
                Copy link
              </Button>
              {socialLinks.map((Icon, index) => (
                <button
                  key={index}
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 text-gray-600 transition hover:bg-primary-50 hover:text-primary-500"
                  aria-label="Share"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function OverviewContent() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">Description</h2>
        <p className="text-sm leading-6 text-gray-600">
          It gives you a huge self-satisfaction when you look at your work and
          say, "I made this!". I love that feeling after I&apos;m done working
          on something. This course is designed to help you build that
          confidence with practical exercises and a clear workflow from concept
          to launch.
        </p>
        <p className="text-sm leading-6 text-gray-600">
          You will learn Figma, Webflow, and the mindset needed to work
          efficiently as a designer and freelancer. The content is structured to
          avoid unnecessary complexity and keep the learning path simple.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">
          What you will learn in this course
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {benefitItems.map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 rounded-xl bg-green-50/60 p-4"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-600" />
              <p className="text-sm leading-6 text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Who this course is for:
          </h2>
          <div className="space-y-3">
            {whoThisCourseIsFor.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary-500" />
                <p className="text-sm leading-6 text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-800">
            Course requirements
          </h2>
          <div className="space-y-3">
            {courseRequirements.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ArrowLeft className="mt-1 h-4 w-4 shrink-0 text-primary-500" />
                <p className="text-sm leading-6 text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">Curriculum</h2>
        <div className="space-y-4">
          {curriculumSections.map((section, index) => (
            <CurriculumAccordion
              key={section.title}
              section={section}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-neutral-800">
          Course Instructor
        </h2>
        <InstructorProfile instructor={instructor} />
        <InstructorProfile instructor={instructorSecond} />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-neutral-800">
          Student Feedback
        </h2>

        <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-6 lg:grid-cols-[260px_1fr] lg:p-8">
          <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-200 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <div className="text-5xl font-semibold text-neutral-800">4.8</div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className="h-5 w-5 fill-warning-500 text-warning-500"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-neutral-800">
              Course Rating
            </p>
          </div>

          <div className="space-y-4">
            {ratingBreakdown.map((item) => (
              <RatingProgressBar
                key={item.star}
                star={item.star}
                percentage={item.percentage}
                count={item.count}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={`${review.name}-${review.time}`} review={review} />
          ))}
        </div>

        <div className="flex justify-center pt-2">
          <Button variant="outline" colorScheme="primary">
            Load more
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function CourseDetail() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />
      <main>
        <HeroHeader />

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <TabsBar />
              <OverviewContent />
            </div>

            <SidebarCard />
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white py-16">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-semibold text-neutral-800">
                Related Courses
              </h2>
              <Button variant="outline" colorScheme="primary">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedCourses.map((course) => (
                <CourseCard key={course.title} {...course} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
