import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import CourseProgressCard, {
  type CourseProgressCardProps,
} from "../../components/CourseProgressCard";
import Input from "../../components/ui/Input";
import Pagination from "../../components/ui/Pagination";

const myCourses: CourseProgressCardProps[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Learn Ethical Hacking From Scratch",
    currentLecture: "31. Learn More About Web Design",
    progressPercentage: 0,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "SQL for NEWBS: Weekender Crash Course",
    currentLecture: "165. Font Properties Challenge 3",
    progressPercentage: 2,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Complete Adobe Lightroom Megacourse",
    currentLecture: "7. Adding Content to Our Website",
    progressPercentage: 0,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Machine Learning A-Z: Hands-On Python & R",
    currentLecture: "651. CSS Font Property Challenge Solution",
    progressPercentage: 23,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Ultimate Google Ads Training 2020",
    currentLecture: "1. Introductions",
    progressPercentage: 0,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Instagram Marketing 2021",
    currentLecture: "54. CSS Static and Relative Positioning",
    progressPercentage: 52,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Automate the Boring Stuff with Python",
    currentLecture: "3. Absolute positioning",
    progressPercentage: 34,
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    courseTitle: "Digital Marketing Masterclass - 23 Courses in 1",
    currentLecture: "6. Learn More About Typography",
    progressPercentage: 51,
  },
];

interface SelectFieldProps {
  label: string;
  options: string[];
}

function SelectField({ label, options }: SelectFieldProps) {
  return (
    <label className="w-full space-y-2">
      <span className="text-xs font-normal text-gray-500">{label}</span>
      <div className="relative">
        <select
          className="h-12 w-full appearance-none rounded-lg bg-white px-4 pr-10 text-base text-gray-600 outline outline-1 outline-gray-200 outline-offset-[-1px] transition focus:outline-2 focus:outline-primary-500"
          defaultValue={options[0]}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-800" />
      </div>
    </label>
  );
}

export default function StudentCourses() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="space-y-8">
      <h2 className="text-3xl leading-8 text-neutral-800">
        <span className="font-semibold">Courses </span>
        <span className="font-normal">(957)</span>
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-end lg:gap-6">
        <div className="w-full space-y-2">
          <p className="text-xs font-normal text-gray-500">Search:</p>
          <Input
            placeholder="Search in your courses..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <SelectField label="Sort by:" options={["Latest", "Oldest", "A-Z"]} />
        <SelectField
          label="Status:"
          options={["All Courses", "In Progress", "Not Started", "Completed"]}
        />
        <SelectField
          label="Teacher:"
          options={[
            "All Teachers",
            "Kevin Gilbert",
            "Dianne Russell",
            "Robert Fox",
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {myCourses.map((course) => (
          <CourseProgressCard
            key={`${course.courseTitle}-${course.currentLecture}`}
            {...course}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
