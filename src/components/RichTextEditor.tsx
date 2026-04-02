import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";

const toolbarItems = [
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
];

interface RichTextEditorProps {
  label: string;
  placeholder: string;
}

export default function RichTextEditor({
  label,
  placeholder,
}: RichTextEditorProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-medium text-neutral-800">{label}</h3>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <textarea
          className="h-64 w-full resize-none border-0 px-4 py-3 text-base text-neutral-800 outline-none placeholder:text-gray-400"
          placeholder={placeholder}
        />
        <div className="flex flex-wrap items-center gap-1 border-t border-gray-200 px-3 py-2">
          {toolbarItems.map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="rounded-md p-2 text-gray-500 transition hover:bg-slate-50 hover:text-neutral-800"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
