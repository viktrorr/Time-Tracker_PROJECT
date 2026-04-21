import { useEffect, useMemo, useState } from "react";
import { formatDurationHHMM, parseDurationHHMM } from "@/shared/utils/duration";

type EntryDurationFormProps = {
  valueMinutes: number;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit: (minutes: number) => Promise<void> | void;
};

function validationMessage(value: string): string | null {
  try {
    parseDurationHHMM(value);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Invalid duration";
  }
}

export function EntryDurationForm({
  valueMinutes,
  disabled = false,
  isSubmitting = false,
  onSubmit
}: EntryDurationFormProps): JSX.Element {
  const [value, setValue] = useState(formatDurationHHMM(valueMinutes));
  const [isEditing, setEditing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const canEdit = !disabled;

  useEffect(() => {
    if (!isEditing) {
      setValue(formatDurationHHMM(valueMinutes));
    }
  }, [valueMinutes, isEditing]);

  const liveError = useMemo(() => {
    if (!isEditing) {
      return null;
    }
    return validationMessage(value);
  }, [isEditing, value]);

  async function handleSave() {
    const parsed = parseDurationHHMM(value);
    await onSubmit(parsed);
    setEditing(false);
    setLocalError(null);
  }

  function handleCancel() {
    setValue(formatDurationHHMM(valueMinutes));
    setEditing(false);
    setLocalError(null);
  }

  if (!canEdit) {
    return <span className="text-sm font-semibold tabular-nums text-slate-900">{formatDurationHHMM(valueMinutes)}</span>;
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        className="rounded-md border border-slate-200 px-2 py-1 text-sm font-semibold tabular-nums text-slate-900 hover:bg-slate-50"
        onClick={() => setEditing(true)}
      >
        {formatDurationHHMM(valueMinutes)}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setLocalError(null);
          }}
          className="w-20 rounded-md border border-slate-300 px-2 py-1 text-right text-sm tabular-nums outline-none focus:border-slate-500"
          placeholder="hh:mm"
          disabled={isSubmitting}
        />
        <button
          type="button"
          disabled={isSubmitting || !!liveError}
          onClick={async () => {
            try {
              await handleSave();
            } catch (error) {
              setLocalError(error instanceof Error ? error.message : "Failed to save duration");
            }
          }}
          className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "..." : "Save"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleCancel}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
        >
          Cancel
        </button>
      </div>
      {liveError ? <p className="text-xs text-rose-600">{liveError}</p> : null}
      {localError ? <p className="text-xs text-rose-600">{localError}</p> : null}
    </div>
  );
}
