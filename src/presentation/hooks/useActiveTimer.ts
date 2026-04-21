"use client";

import { useEffect, useMemo, useState } from "react";
import { useTodayEntries } from "@/presentation/hooks/useTodayEntries";

type ActiveTimerState = {
  elapsedSeconds: number;
  formattedElapsed: string;
};

function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((safe % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function useActiveTimer() {
  const todayEntries = useTodayEntries();
  const activeEntry = todayEntries.data?.activeEntry ?? null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
  }, [activeEntry?.id]);

  useEffect(() => {
    if (!activeEntry) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeEntry]);

  const state: ActiveTimerState = useMemo(() => {
    if (!activeEntry) {
      return {
        elapsedSeconds: 0,
        formattedElapsed: "00:00:00"
      };
    }

    const startedAt = new Date(activeEntry.startedAt).getTime();
    const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));

    return {
      elapsedSeconds,
      formattedElapsed: formatSeconds(elapsedSeconds)
    };
  }, [activeEntry, now]);

  return {
    ...todayEntries,
    activeEntry,
    elapsedSeconds: state.elapsedSeconds,
    formattedElapsed: state.formattedElapsed
  };
}
