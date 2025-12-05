"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar, X } from "lucide-react";

// Types
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface TimeRange {
  start: string;
  end: string;
}

interface PresetOption {
  label: string;
  getValue: () => { dateRange: DateRange; timeRange?: TimeRange };
}

export interface CustomCalendarPickerProps {
  onDateChange?: (dateRange: DateRange) => void;
  onTimeChange?: (timeRange: TimeRange) => void;
  onSelectionChange?: (selection: {
    dateRange: DateRange;
    timeRange: TimeRange;
  }) => void;
  initialDateRange?: DateRange;
  initialTimeRange?: TimeRange;
  showTimePicker?: boolean;
  showPresets?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Helper functions
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isDateInRange = (
  date: Date,
  start: Date | null,
  end: Date | null
): boolean => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
};

// Month names
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Preset options factory
const createPresets = (): PresetOption[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [
    {
      label: "Today",
      getValue: () => ({
        dateRange: { start: new Date(today), end: new Date(today) },
      }),
    },
    {
      label: "Yesterday",
      getValue: () => {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          dateRange: { start: yesterday, end: yesterday },
        };
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return {
          dateRange: { start, end: new Date(today) },
        };
      },
    },
    {
      label: "Last 14 Days",
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 13);
        return {
          dateRange: { start, end: new Date(today) },
        };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return {
          dateRange: { start, end: new Date(today) },
        };
      },
    },
    {
      label: "This Week",
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - start.getDay());
        return {
          dateRange: { start, end: new Date(today) },
        };
      },
    },
    {
      label: "Last Week",
      getValue: () => {
        const start = new Date(today);
        start.setDate(start.getDate() - start.getDay() - 7);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return {
          dateRange: { start, end },
        };
      },
    },
    {
      label: "This Month",
      getValue: () => {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          dateRange: { start, end: new Date(today) },
        };
      },
    },
    {
      label: "Last Month",
      getValue: () => {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          dateRange: { start, end },
        };
      },
    },
    {
      label: "This Year",
      getValue: () => {
        const start = new Date(today.getFullYear(), 0, 1);
        return {
          dateRange: { start, end: new Date(today) },
        };
      },
    },
  ];
};

// Time Picker Component
interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, label }) => {
  const [hours, minutes] = value.split(":").map((v) => parseInt(v, 10) || 0);

  const handleHourChange = (newHour: number) => {
    const h = Math.max(0, Math.min(23, newHour));
    onChange(`${h.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  };

  const handleMinuteChange = (newMinute: number) => {
    const m = Math.max(0, Math.min(59, newMinute));
    onChange(`${hours.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
        <Clock className="w-4 h-4 text-[#0E7490]" />
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => handleHourChange(hours + 1)}
              className="text-gray-400 hover:text-[#0E7490] transition-colors p-1"
            >
              <ChevronLeft className="w-3 h-3 rotate-90" />
            </button>
            <input
              type="text"
              value={hours.toString().padStart(2, "0")}
              onChange={(e) => handleHourChange(parseInt(e.target.value, 10) || 0)}
              className="w-8 text-center bg-white rounded border border-gray-200 py-1 text-sm font-medium focus:outline-none focus:border-[#0E7490]"
            />
            <button
              type="button"
              onClick={() => handleHourChange(hours - 1)}
              className="text-gray-400 hover:text-[#0E7490] transition-colors p-1"
            >
              <ChevronLeft className="w-3 h-3 -rotate-90" />
            </button>
          </div>
          <span className="text-lg font-semibold text-gray-600">:</span>
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => handleMinuteChange(minutes + 1)}
              className="text-gray-400 hover:text-[#0E7490] transition-colors p-1"
            >
              <ChevronLeft className="w-3 h-3 rotate-90" />
            </button>
            <input
              type="text"
              value={minutes.toString().padStart(2, "0")}
              onChange={(e) => handleMinuteChange(parseInt(e.target.value, 10) || 0)}
              className="w-8 text-center bg-white rounded border border-gray-200 py-1 text-sm font-medium focus:outline-none focus:border-[#0E7490]"
            />
            <button
              type="button"
              onClick={() => handleMinuteChange(minutes - 1)}
              className="text-gray-400 hover:text-[#0E7490] transition-colors p-1"
            >
              <ChevronLeft className="w-3 h-3 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Calendar Picker Component
const CustomCalendarPicker: React.FC<CustomCalendarPickerProps> = ({
  onDateChange,
  onTimeChange,
  onSelectionChange,
  initialDateRange,
  initialTimeRange,
  showTimePicker = true,
  showPresets = true,
  minDate,
  maxDate,
}) => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || { start: null, end: null }
  );
  const [timeRange, setTimeRange] = useState<TimeRange>(
    initialTimeRange || { start: "00:00", end: "23:59" }
  );
  const [selectionState, setSelectionState] = useState<
    "idle" | "selecting" | "complete"
  >("idle");
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "time">("calendar");

  const containerRef = useRef<HTMLDivElement>(null);
  const presets = useMemo(() => createPresets(), []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calendar data
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (Date | null)[] = [];

    // Previous month padding
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentMonth, currentYear]);

  // Handlers
  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDateDisabled(date, minDate, maxDate)) return;

      if (selectionState === "idle" || selectionState === "complete") {
        // Start new selection
        setDateRange({ start: date, end: null });
        setSelectionState("selecting");
      } else if (selectionState === "selecting") {
        // Complete the range
        const start = dateRange.start!;
        if (date < start) {
          setDateRange({ start: date, end: start });
        } else {
          setDateRange({ start, end: date });
        }
        setSelectionState("complete");
      }
    },
    [selectionState, dateRange.start, minDate, maxDate]
  );

  const handlePresetClick = useCallback((preset: PresetOption) => {
    const { dateRange: newRange, timeRange: newTime } = preset.getValue();
    setDateRange(newRange);
    if (newTime) {
      setTimeRange(newTime);
    }
    setSelectionState("complete");

    // Navigate to the start date's month
    if (newRange.start) {
      setCurrentMonth(newRange.start.getMonth());
      setCurrentYear(newRange.start.getFullYear());
    }
  }, []);

  const handleClear = useCallback(() => {
    setDateRange({ start: null, end: null });
    setTimeRange({ start: "00:00", end: "23:59" });
    setSelectionState("idle");
    setHoverDate(null);
  }, []);

  const handleApply = useCallback(() => {
    onDateChange?.(dateRange);
    onTimeChange?.(timeRange);
    onSelectionChange?.({ dateRange, timeRange });
    setIsOpen(false);
  }, [dateRange, timeRange, onDateChange, onTimeChange, onSelectionChange]);

  // Get display text for the trigger button
  const getDisplayText = useCallback(() => {
    if (!dateRange.start) {
      return "Select date range";
    }
    if (!dateRange.end || isSameDay(dateRange.start, dateRange.end)) {
      return formatDate(dateRange.start);
    }
    return `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;
  }, [dateRange]);

  // Determine if a day should show hover range
  const isInHoverRange = useCallback(
    (date: Date) => {
      if (selectionState !== "selecting" || !dateRange.start || !hoverDate)
        return false;
      const start = dateRange.start;
      if (hoverDate < start) {
        return date >= hoverDate && date <= start;
      }
      return date >= start && date <= hoverDate;
    },
    [selectionState, dateRange.start, hoverDate]
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-[#0E7490] transition-all duration-200 group"
      >
        <Calendar className="w-5 h-5 text-[#0E7490]" />
        <span className="text-gray-700 font-medium">{getDisplayText()}</span>
        {dateRange.start && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex">
            {/* Presets Panel */}
            {showPresets && (
              <div className="w-44 border-r border-gray-100 p-4 bg-gray-50">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Quick Select
                </h3>
                <div className="flex flex-col gap-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className="text-left px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-[#0E7490] rounded-lg transition-all duration-150"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Panel */}
            <div className="p-5">
              {/* Tabs */}
              {showTimePicker && (
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("calendar")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === "calendar"
                        ? "bg-[#0E7490] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Date
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("time")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === "time"
                        ? "bg-[#0E7490] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Time
                  </button>
                </div>
              )}

              {/* Calendar View */}
              {activeTab === "calendar" && (
                <div>
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-semibold text-[#0E7490]">
                      {MONTHS[currentMonth]} {currentYear}
                    </h2>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-400 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} className="w-10 h-10" />;
                      }

                      const isStart = isSameDay(date, dateRange.start);
                      const isEnd = isSameDay(date, dateRange.end);
                      const isInRange = isDateInRange(
                        date,
                        dateRange.start,
                        dateRange.end
                      );
                      const isHovered = isInHoverRange(date);
                      const isDisabled = isDateDisabled(date, minDate, maxDate);
                      const isToday = isSameDay(date, new Date());

                      let dayClasses =
                        "w-10 h-10 flex items-center justify-center text-sm rounded-xl transition-all duration-150 ";

                      if (isDisabled) {
                        dayClasses += "text-gray-300 cursor-not-allowed";
                      } else if (isStart || isEnd) {
                        dayClasses +=
                          "bg-[#0E7490] text-white font-semibold cursor-pointer";
                      } else if (isInRange) {
                        dayClasses +=
                          "bg-[#0E7490]/20 text-[#0E7490] cursor-pointer";
                      } else if (isHovered) {
                        dayClasses +=
                          "bg-[#059669]/10 text-[#059669] cursor-pointer";
                      } else if (isToday) {
                        dayClasses +=
                          "border-2 border-[#0E7490] text-[#0E7490] font-medium cursor-pointer hover:bg-[#0E7490]/10";
                      } else {
                        dayClasses +=
                          "text-gray-700 cursor-pointer hover:bg-gray-100";
                      }

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => handleDateClick(date)}
                          onMouseEnter={() =>
                            selectionState === "selecting" && setHoverDate(date)
                          }
                          onMouseLeave={() => setHoverDate(null)}
                          disabled={isDisabled}
                          className={dayClasses}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selection Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {selectionState === "selecting"
                          ? "Click another date to complete range"
                          : dateRange.start
                          ? "Range selected"
                          : "Click a date to start"}
                      </span>
                      {dateRange.start && (
                        <span className="text-[#0E7490] font-medium">
                          {getDisplayText()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Time View */}
              {activeTab === "time" && showTimePicker && (
                <div className="min-w-[280px]">
                  <div className="grid grid-cols-2 gap-4">
                    <TimePicker
                      label="Start Time"
                      value={timeRange.start}
                      onChange={(time) =>
                        setTimeRange((prev) => ({ ...prev, start: time }))
                      }
                    />
                    <TimePicker
                      label="End Time"
                      value={timeRange.end}
                      onChange={(time) =>
                        setTimeRange((prev) => ({ ...prev, end: time }))
                      }
                    />
                  </div>

                  {/* Quick Time Presets */}
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Quick Time Ranges
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "All Day", start: "00:00", end: "23:59" },
                        { label: "Morning", start: "06:00", end: "12:00" },
                        { label: "Afternoon", start: "12:00", end: "18:00" },
                        { label: "Evening", start: "18:00", end: "23:59" },
                        { label: "Business Hours", start: "09:00", end: "17:00" },
                        { label: "Night", start: "22:00", end: "06:00" },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setTimeRange({ start: preset.start, end: preset.end })
                          }
                          className="px-3 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-[#0E7490]/10 hover:text-[#0E7490] rounded-lg transition-all duration-150"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Time Display */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Selected time range:</span>
                      <span className="text-[#0E7490] font-medium">
                        {timeRange.start} - {timeRange.end}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-6 py-2 text-sm text-white bg-[#0E7490] hover:bg-[#0E7490]/90 rounded-xl transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendarPicker;
