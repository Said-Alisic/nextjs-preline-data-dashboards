"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import CustomCalendarPicker, { DateRange, TimeRange } from "./CustomCalendarPicker";

interface DashboardDatePickerProps {
  showTimePicker?: boolean;
  showPresets?: boolean;
}

const formatDateForUrl = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const parseDateFromUrl = (dateStr: string | null): Date | null => {
  if (!dateStr) return null;
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const DashboardDatePicker: React.FC<DashboardDatePickerProps> = ({
  showTimePicker = false,
  showPresets = true,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial values from URL
  const initialDateRange = useMemo((): DateRange => {
    const startDate = parseDateFromUrl(searchParams.get("startDate"));
    const endDate = parseDateFromUrl(searchParams.get("endDate"));
    return { start: startDate, end: endDate };
  }, [searchParams]);

  const initialTimeRange = useMemo((): TimeRange => {
    return {
      start: searchParams.get("startTime") || "00:00",
      end: searchParams.get("endTime") || "23:59",
    };
  }, [searchParams]);

  // Update URL when selection changes
  const handleSelectionChange = useCallback(
    (selection: { dateRange: DateRange; timeRange: TimeRange }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (selection.dateRange.start) {
        params.set("startDate", formatDateForUrl(selection.dateRange.start));
      } else {
        params.delete("startDate");
      }

      if (selection.dateRange.end) {
        params.set("endDate", formatDateForUrl(selection.dateRange.end));
      } else {
        params.delete("endDate");
      }

      if (showTimePicker) {
        if (selection.timeRange.start !== "00:00") {
          params.set("startTime", selection.timeRange.start);
        } else {
          params.delete("startTime");
        }

        if (selection.timeRange.end !== "23:59") {
          params.set("endTime", selection.timeRange.end);
        } else {
          params.delete("endTime");
        }
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, showTimePicker]
  );

  return (
    <CustomCalendarPicker
      initialDateRange={initialDateRange}
      initialTimeRange={initialTimeRange}
      showTimePicker={showTimePicker}
      showPresets={showPresets}
      onSelectionChange={handleSelectionChange}
    />
  );
};

export default DashboardDatePicker;
