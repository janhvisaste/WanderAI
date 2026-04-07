"use client";
import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar } from "lucide-react";

type Props = {
  selectedRange: { from?: Date; to?: Date };
  onRangeChange: (range: { from?: Date; to?: Date }) => void;
  tripDays?: number;
};

export default function CalendarWidget({
  selectedRange,
  onRangeChange,
  tripDays,
}: Props) {
  const [month, setMonth] = useState(new Date());

  // Auto-scroll to selected dates
  useEffect(() => {
    if (selectedRange.from) {
      setMonth(selectedRange.from);
    }
  }, [selectedRange.from]);

  const handleSelect = (range: DateRange | undefined) => {
    onRangeChange({ from: range?.from, to: range?.to });
  };

  const handleClear = () => {
    onRangeChange({});
  };

  return (
    <div className="bg-[var(--bg-card)] rounded-[2rem] p-5 border border-[var(--border)] shadow-md h-fit">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-[var(--text-primary)] font-semibold flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-orange-500" />
          Trip Dates
        </h3>
        <div className="flex items-center gap-2">
          {tripDays && selectedRange.from && (
            <span className="text-[10px] text-orange-400 font-medium bg-orange-500/10 px-2 py-0.5 rounded-full">
              {tripDays} days
            </span>
          )}
          <button
            onClick={handleClear}
            className="text-[10px] text-orange-500 font-bold uppercase tracking-wider cursor-pointer hover:text-orange-400"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Show selected dates */}
      {selectedRange.from && (
        <div className="flex items-center gap-2 px-2 mb-3">
          <div className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2 text-center">
            <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold">
              Check-in
            </p>
            <p className="text-sm text-[var(--text-primary)] font-medium">
              {selectedRange.from.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-gray-600">→</div>
          <div className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-3 py-2 text-center">
            <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold">
              Check-out
            </p>
            <p className="text-sm text-[var(--text-primary)] font-medium">
              {selectedRange.to
                ? selectedRange.to.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
      )}

      <style>{`
        .rdp {
          --rdp-cell-size: 34px;
          --rdp-accent-color: #f97316;
          --rdp-background-color: rgba(249,115,22,0.1);
          --rdp-accent-color-dark: #ea580c;
          --rdp-background-color-dark: rgba(234,88,12,0.1);
          --rdp-outline: 2px solid var(--rdp-accent-color);
          --rdp-outline-selected: 2px solid rgba(0, 0, 0, 0.1);
          margin: 0;
          width: 100%;
        }
        .rdp-day_selected,
        .rdp-day_selected:focus-visible,
        .rdp-day_selected:hover {
          color: white !important;
          opacity: 1;
          background-color: var(--rdp-accent-color) !important;
        }
        .rdp-day_range_middle {
          background-color: rgba(249,115,22,0.15) !important;
          color: #fb923c !important;
          border-radius: 0;
        }
        .rdp-day_range_start {
          border-radius: 12px 0 0 12px !important;
        }
        .rdp-day_range_end {
          border-radius: 0 12px 12px 0 !important;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: var(--rdp-background-color);
        }
        .rdp-day {
          font-size: 0.8rem;
          border-radius: 10px;
          color: var(--text-secondary);
        }
        .rdp-caption_label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .rdp-head_cell {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
        }
        .rdp-nav_button {
          color: var(--text-primary);
        }
        .rdp-month {
          width: 100%;
        }
        .rdp-table {
          width: 100%;
          max-width: 100%;
        }
      `}</style>

      <div className="w-full flex justify-center">
        <DayPicker
          mode="range"
          selected={
            selectedRange.from
              ? { from: selectedRange.from, to: selectedRange.to }
              : undefined
          }
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={{ before: new Date() }}
        />
      </div>
    </div>
  );
}
