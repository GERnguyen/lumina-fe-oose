import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useCategories } from "../../hooks/queries/useCategories";
import {
  isBasicDraftComplete,
  useCreateCourseDraftStore,
} from "../../stores/useCreateCourseDraftStore";

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number | null;
  options: { id: number; name: string }[];
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="space-y-1.5">
      <span className="block text-sm font-medium text-neutral-800">
        {label}
      </span>
      <div className="relative">
        <select
          className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-base text-neutral-800 outline-none transition focus:border-primary-500"
          value={value ?? ""}
          onChange={(event) => {
            const next = Number(event.target.value);
            onChange(Number.isNaN(next) || next <= 0 ? null : next);
          }}
        >
          <option value="">Select category...</option>
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
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
  const { basic, setBasic } = useCreateCourseDraftStore();
  const categoriesQuery = useCategories();
  const [errorMessage, setErrorMessage] = useState("");

  const canContinue = isBasicDraftComplete(basic);

  const handleNext = () => {
    if (!canContinue) {
      setErrorMessage(
        "Please fill Title, Category, Thumbnail URL and Description before continuing.",
      );
      return;
    }

    setErrorMessage("");
    navigate("/instructor/create-course/curriculum");
  };

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <Input
        label="Title"
        placeholder="Your course title"
        value={basic.title}
        onChange={(event) => setBasic({ title: event.target.value })}
      />

      <div className="grid grid-cols-1 gap-5">
        <SelectField
          label="Course Category"
          value={basic.categoryId}
          options={(categoriesQuery.data ?? []).map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          onChange={(categoryId) => setBasic({ categoryId })}
        />
      </div>

      <Input
        label="Thumbnail URL"
        placeholder="https://example.com/image.jpg"
        value={basic.thumbnailUrl}
        onChange={(event) => setBasic({ thumbnailUrl: event.target.value })}
      />

      <Input
        label="Price (VND)"
        type="number"
        min={0}
        placeholder="0"
        value={String(basic.price)}
        onChange={(event) =>
          setBasic({ price: Math.max(0, Number(event.target.value) || 0) })
        }
      />

      <label className="space-y-1.5">
        <span className="block text-sm font-medium text-neutral-800">
          Course Description
        </span>
        <textarea
          className="h-40 w-full resize-none rounded-lg bg-white px-4 py-3 text-neutral-800 outline outline-1 outline-gray-400 outline-offset-[-1px] placeholder:text-gray-500 focus:outline-2 focus:outline-primary-500"
          placeholder="Enter your course description"
          value={basic.description}
          onChange={(event) => setBasic({ description: event.target.value })}
        />
      </label>

      {errorMessage ? (
        <p className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {errorMessage}
        </p>
      ) : null}

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
          onClick={handleNext}
        >
          Save &amp; next
        </Button>
      </div>
    </div>
  );
}
