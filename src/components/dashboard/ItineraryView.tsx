"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Lightbulb, DollarSign, Sunrise, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Activity = {
  time: string;
  title: string;
  description: string;
  estimated_cost: string;
  icon: string;
};

type DayData = {
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  daily_cost_estimate: string;
  image_query: string;
};

type Tip = {
  category: string;
  tip: string;
  icon: string;
};

type Props = {
  destination: string;
  days: number;
  budget: string;
  summary: string;
  itinerary: DayData[];
  tips: Tip[];
  total_cost_estimate: string;
  cached: boolean;
};

const TIME_ICONS: Record<string, React.ReactNode> = {
  morning: <Sunrise className="w-3.5 h-3.5 text-amber-400" />,
  afternoon: <Sun className="w-3.5 h-3.5 text-orange-400" />,
  evening: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
};

const TIME_COLORS: Record<string, string> = {
  morning: "border-amber-500/20 bg-amber-500/5",
  afternoon: "border-orange-500/20 bg-orange-500/5",
  evening: "border-indigo-500/20 bg-indigo-500/5",
};

const DAY_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80",
  "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
  "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80",
  "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80",
];

export default function ItineraryView({
  destination,
  days,
  budget,
  summary,
  itinerary,
  tips,
  total_cost_estimate,
  cached,
}: Props) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            ✈️ {destination}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {days} days • {budget} • {total_cost_estimate}
          </p>
        </div>
        {cached && (
          <span className="text-[9px] font-bold bg-green-500/15 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
            ⚡ Cached
          </span>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-primary)]/60 border border-[var(--border)] rounded-xl p-4">
        {summary}
      </p>

      {/* Day Cards */}
      <div className="space-y-3">
        {itinerary.map((day, idx) => {
          const isExpanded = expandedDays.has(day.day);
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-orange-500/20 transition-colors"
            >
              {/* Day header — clickable */}
              <button
                onClick={() => toggleDay(day.day)}
                className="w-full flex items-center gap-3 p-4 text-left group"
              >
                {/* Day image thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--hover)]">
                  <img
                    src={DAY_IMAGES[idx % DAY_IMAGES.length]}
                    alt={day.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                      DAY {day.day}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {day.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {day.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {day.daily_cost_estimate && (
                    <span className="text-[10px] text-[var(--text-muted)] font-medium bg-[var(--hover)] px-2 py-1 rounded-md border border-[var(--border)]">
                      {day.daily_cost_estimate}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </div>
              </button>

              {/* Expanded activities */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2.5 border-t border-[var(--border)] pt-3">
                      {day.activities.map((act, i) => (
                        <div
                          key={i}
                          className={`flex gap-3 p-3 rounded-xl border ${
                            TIME_COLORS[act.time] || "border-[var(--border)] bg-[var(--hover)]"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                            {TIME_ICONS[act.time] || <Sun className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
                            <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase">
                              {act.time}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-sm">{act.icon}</span>
                              <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                                {act.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                              {act.description}
                            </p>
                          </div>
                          {act.estimated_cost && (
                            <span className="text-[10px] text-[var(--text-muted)] font-medium flex-shrink-0 flex items-center gap-0.5">
                              <DollarSign className="w-3 h-3" />
                              {act.estimated_cost}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Tips Section */}
      {tips.length > 0 && (
        <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Travel Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--hover)] border border-[var(--border)]"
              >
                <span className="text-sm flex-shrink-0">{tip.icon}</span>
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase block mb-0.5">
                    {tip.category}
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)]">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
