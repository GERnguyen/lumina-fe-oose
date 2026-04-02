import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function SelectField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="block text-sm font-medium text-neutral-800">
        {label}
      </span>
      <div className="relative">
        <select className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-base text-gray-500 outline-none transition focus:border-primary-500">
          <option>{placeholder}</option>
          <option>Option 1</option>
          <option>Option 2</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
    </label>
  );
}

export default function BasicInformation() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <Input label="Title" placeholder="Your course title" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SelectField label="Course Category" placeholder="Select..." />
        <SelectField label="Course Sub-category" placeholder="Select..." />
      </div>

      <Input
        label="Course Topic"
        placeholder="What is primarily taught in your course?"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SelectField label="Course Language" placeholder="Select..." />
        <SelectField
          label="Subtitle Language (Optional)"
          placeholder="Select..."
        />
        <SelectField label="Course Level" placeholder="Select..." />
        <label className="space-y-1.5">
          <span className="block text-sm font-medium text-neutral-800">
            Durations
          </span>
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4">
            <input
              className="h-12 w-full border-0 bg-transparent text-base text-neutral-800 outline-none placeholder:text-gray-400"
              placeholder="Course durations"
            />
            <select className="h-12 border-0 bg-transparent text-sm text-gray-600 outline-none">
              <option>Day</option>
              <option>Hour</option>
            </select>
          </div>
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          colorScheme="gray"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor")}
        >
          Cancel
        </Button>
        <Button
          colorScheme="primary"
          className="w-full sm:w-auto"
          onClick={() => navigate("/instructor/create-course/advance")}
        >
          Save &amp; next
        </Button>
      </div>
    </div>
  );
}
