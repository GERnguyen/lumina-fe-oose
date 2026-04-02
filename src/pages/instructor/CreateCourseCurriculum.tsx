import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import CurriculumLecture from "../../components/CurriculumLecture";
import CurriculumSection from "../../components/CurriculumSection";

const sections = [
  {
    id: "section-1",
    title: "Section name",
    lectures: ["Lecture name", "Lecture name"],
  },
];

export default function CreateCourseCurriculum() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="space-y-3 p-4 sm:p-5">
          {sections.map((section) => (
            <CurriculumSection key={section.id} title={section.title}>
              {section.lectures.map((lecture, index) => (
                <CurriculumLecture
                  key={`${section.id}-${index}`}
                  title={lecture}
                />
              ))}
            </CurriculumSection>
          ))}

          <Button
            variant="outline"
            colorScheme="primary"
            className="w-full bg-orange-50"
          >
            <Plus className="h-4 w-4" />
            Add Sections
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          colorScheme="gray"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/advance")}
        >
          Previous
        </Button>
        <Button
          colorScheme="primary"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/publish")}
        >
          Save &amp; next
        </Button>
      </div>
    </div>
  );
}
