import {
  Briefcase,
  Dumbbell,
  GraduationCap,
  Monitor,
  Palette,
  PlayCircle,
} from "lucide-react";
import CategoryCard, {
  type CategoryCardProps,
} from "../components/CategoryCard";
import CourseCard, { type CourseCardProps } from "../components/CourseCard";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/ui/Button";

const categories: CategoryCardProps[] = [
  { icon: Monitor, name: "Development", courseCount: 63476, tone: "secondary" },
  { icon: Briefcase, name: "Business", courseCount: 52822, tone: "success" },
  { icon: Palette, name: "Design", courseCount: 22649, tone: "warning" },
  {
    icon: Dumbbell,
    name: "Health & Fitness",
    courseCount: 1678,
    tone: "success",
  },
  {
    icon: GraduationCap,
    name: "Productivity",
    courseCount: 13932,
    tone: "gray",
  },
  {
    icon: PlayCircle,
    name: "Photography & Video",
    courseCount: 6196,
    tone: "primary",
  },
];

const featuredCourses: CourseCardProps[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    title: "Complete Python Bootcamp: From Zero to Hero",
    category: "Development",
    categoryTone: "secondary",
    price: 14,
    originalPrice: 26,
    rating: 5,
    students: 265700,
    author: "Kevin Gilbert",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    title: "The Complete Web Development Bootcamp",
    category: "IT & Software",
    categoryTone: "danger",
    price: 19,
    originalPrice: 39,
    rating: 4.9,
    students: 198200,
    author: "Darrell Steward",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    title: "Digital Marketing Mastery 2026",
    category: "Marketing",
    categoryTone: "primary",
    price: 17,
    originalPrice: 31,
    rating: 4.8,
    students: 152340,
    author: "Jane Cooper",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    title: "Machine Learning A-Z with Python",
    category: "Business",
    categoryTone: "success",
    price: 21,
    originalPrice: 49,
    rating: 4.7,
    students: 99050,
    author: "Albert Flores",
  },
];

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight text-neutral-800 sm:text-5xl lg:text-6xl">
            Learn with experts anytime, anywhere
          </h1>
          <p className="max-w-xl text-lg text-gray-600">
            Our mission is to help people find the best online course and learn
            practical skills to grow their careers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button colorScheme="primary" size="lg">
              Create account
            </Button>
            <Button variant="outline" colorScheme="gray" size="lg">
              Explore courses
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1400&auto=format&fit=crop"
            alt="Students learning online"
            className="h-[420px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function SponsorsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-neutral-800">
            6.3k trusted companies
          </h2>
          <p className="max-w-md text-sm text-gray-600">
            Top organizations trust Cinx to train teams with job-ready online
            learning experiences.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {["Netflix", "Slack", "Google", "Lenovo", "Microsoft", "YouTube"].map(
            (brand) => (
              <div
                key={brand}
                className="flex h-20 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-500 shadow-sm"
              >
                {brand}
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function TopCategoriesSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <h2 className="text-4xl font-semibold text-neutral-800">
            Browse top category
          </h2>
          <p className="text-sm text-gray-600">
            Explore in-demand topics and start learning fast.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCoursesSection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <h2 className="text-4xl font-semibold text-neutral-800">
            Our featured courses
          </h2>
          <p className="max-w-md text-sm text-gray-600">
            Curated picks from high-rated instructors to help you level up your
            skills and portfolio.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}

function InstructorCTASection() {
  const steps = [
    "Apply to become instructor",
    "Build and edit your profile",
    "Create your first course",
    "Start teaching and earning",
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-xl bg-neutral-800 p-8 text-white">
          <h3 className="text-3xl font-semibold">Become an instructor</h3>
          <p className="mt-3 max-w-md text-sm text-gray-300">
            Instructors from around the world teach millions of students on
            Cinx. Share your expertise and grow with us.
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              colorScheme="gray"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Start teaching
            </Button>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-8">
          <h3 className="text-3xl font-semibold text-neutral-800">
            Your teaching steps
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-lg bg-gray-50 p-4"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
                  {index + 1}
                </span>
                <p className="text-sm text-neutral-800">{step}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-800">
      <Header />
      <main>
        <HeroSection />
        <SponsorsSection />
        <TopCategoriesSection />
        <FeaturedCoursesSection />
        <InstructorCTASection />
      </main>
      <Footer />
    </div>
  );
}
