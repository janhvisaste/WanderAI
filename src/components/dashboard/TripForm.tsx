"use client";
import { useState } from "react";
import { MapPin, Calendar, Wallet, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  initialDestination?: string;
  onGenerate: (data: {
    destination: string;
    days: number;
    budget: string;
    preferences: string[];
  }) => void;
  isLoading: boolean;
};

const PREFERENCES = [
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "nightlife", label: "Nightlife", emoji: "🌃" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "adventure", label: "Adventure", emoji: "🏄" },
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "wellness", label: "Wellness", emoji: "🧘" },
];

const BUDGETS = [
  { value: "budget", label: "Budget", emoji: "💰" },
  { value: "mid-range", label: "Mid-Range", emoji: "💎" },
  { value: "luxury", label: "Luxury", emoji: "✨" },
];

export default function TripForm({
  initialDestination = "",
  onGenerate,
  isLoading,
}: Props) {
  const [destination, setDestination] = useState(initialDestination);
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState("mid-range");
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const togglePref = (id: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!destination.trim()) return;
    onGenerate({ destination: destination.trim(), days, budget, preferences: selectedPrefs });
  };

  return (
    <div className="space-y-5">
      {/* Destination Input */}
      <div>
        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Bali, Paris, Tokyo..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl py-3 pl-4 pr-4 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all text-sm"
        />
      </div>

      {/* Days Selector */}
      <div>
        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-orange-500" />
          Duration: <span className="text-orange-400">{days} days</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="21"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="flex-1 h-2 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-orange-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(249,115,22,0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-1.5 min-w-[50px] text-center">
            <span className="text-[var(--text-primary)] text-sm font-bold">{days}</span>
          </div>
        </div>
      </div>

      {/* Budget Dropdown */}
      <div>
        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Wallet className="w-3.5 h-3.5 text-orange-500" />
          Budget
        </label>
        <div className="grid grid-cols-3 gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b.value}
              onClick={() => setBudget(b.value)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                budget === b.value
                  ? "bg-orange-500/15 border-orange-500/50 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                  : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-orange-500/20 hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="text-base mr-1">{b.emoji}</span>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preference Chips */}
      <div>
        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 block">
          🎯 Preferences
        </label>
        <div className="flex flex-wrap gap-2">
          {PREFERENCES.map((pref) => {
            const isSelected = selectedPrefs.includes(pref.id);
            return (
              <motion.button
                key={pref.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => togglePref(pref.id)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all border ${
                  isSelected
                    ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                    : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-orange-500/20 hover:text-[var(--text-primary)]"
                }`}
              >
                <span className="mr-1">{pref.emoji}</span>
                {pref.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        onClick={handleGenerate}
        disabled={isLoading || !destination.trim()}
        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:shadow-[0_0_35px_rgba(249,115,22,0.35)] disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Plan...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Plan
          </>
        )}
      </motion.button>
    </div>
  );
}
