import { ColorDot } from "@/presentation/components/ui/ColorDot";
import { PROJECT_COLOR_PALETTE } from "@/presentation/components/projects/project-colors";

type ProjectColorPickerProps = {
  value: string;
  onChange: (colorHex: string) => void;
};

export function ProjectColorPicker({ value, onChange }: ProjectColorPickerProps): JSX.Element {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">Color</p>
      <div className="flex flex-wrap gap-2">
        {PROJECT_COLOR_PALETTE.map((color) => {
          const selected = value.toLowerCase() === color.toLowerCase();

          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs ${
                selected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ColorDot colorHex={color} className="h-3 w-3" />
              {color}
            </button>
          );
        })}
      </div>
    </div>
  );
}
