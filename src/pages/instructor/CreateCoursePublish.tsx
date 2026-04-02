import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InstructorBadge from "../../components/ui/InstructorBadge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const instructors = [
  {
    id: "ins-1",
    avatarUrl: "https://placehold.co/48x48",
    username: "Username",
    role: "UI/UX Designer",
  },
  {
    id: "ins-2",
    avatarUrl: "https://placehold.co/48x48",
    username: "Username",
    role: "UI/UX Designer",
  },
];

export default function CreateCoursePublish() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-medium text-neutral-800">Message</h3>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-neutral-800">
              Welcome Message
            </span>
            <textarea
              className="h-36 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-neutral-800 outline-none placeholder:text-gray-400 focus:border-primary-500"
              placeholder="Enter course starting message here..."
            />
          </label>

          <label className="space-y-1.5">
            <span className="block text-sm font-medium text-neutral-800">
              Congratulations Message
            </span>
            <textarea
              className="h-36 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-neutral-800 outline-none placeholder:text-gray-400 focus:border-primary-500"
              placeholder="Enter your course completed message here..."
            />
          </label>
        </div>
      </section>

      <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-medium text-neutral-800">
          Add Instructor (02)
        </h3>

        <div className="max-w-2xl">
          <Input
            placeholder="Search by username"
            leftIcon={<Search className="h-5 w-5 text-neutral-800" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {instructors.map((instructor) => (
            <InstructorBadge
              key={instructor.id}
              avatarUrl={instructor.avatarUrl}
              username={instructor.username}
              role={instructor.role}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          colorScheme="gray"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/curriculum")}
        >
          Prev step
        </Button>
        <Button
          colorScheme="primary"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor")}
        >
          Submit for review
        </Button>
      </div>
    </div>
  );
}
