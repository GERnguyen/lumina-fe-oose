import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import DynamicInputList from "../../components/DynamicInputList";
import RichTextEditor from "../../components/RichTextEditor";
import UploadBox from "../../components/UploadBox";

const teachItems = [
  "What you will teach in this course...",
  "What you will teach in this course...",
  "What you will teach in this course...",
  "What you will teach in this course...",
];

const audienceItems = [
  "Who this course is for...",
  "Who this course is for...",
  "Who this course is for...",
  "Who this course is for...",
];

const requirementItems = [
  "What is you course requirements...",
  "What is you course requirements...",
  "What is you course requirements...",
  "What is you course requirements...",
];

export default function AdvanceInformation() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <UploadBox
          title="Course Thumbnail"
          helperText="Upload your course thumbnail here. Important guidelines: 1200x800 pixels or 12:8 Ratio. Supported format: .jpg, .jpeg, or .png"
          buttonLabel="Upload image"
        />
        <UploadBox
          title="Course Trailer"
          helperText="Students who watch a well-made promo video are 5X more likely to enroll in your course. We've seen that statistic go up to 10X for exceptionally awesome videos."
          buttonLabel="Upload Video"
        />
      </div>

      <RichTextEditor
        label="Course Descriptions"
        placeholder="Enter you course descriptions"
      />

      <DynamicInputList
        title="What you will teach in this course (4/8)"
        buttonLabel="Add new"
        placeholder="What you will teach in this course..."
        items={teachItems}
      />

      <DynamicInputList
        title="Target Audience (4/8)"
        buttonLabel="Add new"
        placeholder="Who this course is for..."
        items={audienceItems}
      />

      <DynamicInputList
        title="Course requirements (4/8)"
        buttonLabel="Add new"
        placeholder="What is you course requirements..."
        items={requirementItems}
      />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          colorScheme="gray"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/basic")}
        >
          Previous
        </Button>
        <Button
          colorScheme="primary"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/curriculum")}
        >
          Save &amp; next
        </Button>
      </div>
    </div>
  );
}
