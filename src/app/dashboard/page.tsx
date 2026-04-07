"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TripForm from "@/components/dashboard/TripForm";
import ItineraryView from "@/components/dashboard/ItineraryView";
import CalendarWidget from "@/components/dashboard/CalendarWidget";
import TripPlanView from "@/components/dashboard/TripPlanView";
import HotelMapView from "@/components/dashboard/HotelMapView";
import { saveTrip, toggleFavorite, isFavorite } from "@/lib/tripStorage";
import { Save, Heart, Check, LogOut, User, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Hotel = {
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  rating: number;
  amenities: string[];
  image_url: string;
  latitude: number;
  longitude: number;
  booking_url: string;
};

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

type TripResult = {
  destination: string;
  days: number;
  budget: string;
  preferences: string[];
  summary: string;
  itinerary: DayData[];
  tips: Tip[];
  total_cost_estimate: string;
  cached: boolean;
  hotels: Hotel[];
  center_lat: number;
  center_lng: number;
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "";
  const { user, signOut } = useAuth();

  const [tripResult, setTripResult] = useState<TripResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDates, setSelectedDates] = useState<{ from?: Date; to?: Date }>({});
  const [showMap, setShowMap] = useState(false);
  const [saved, setSaved] = useState(false);
  const [faved, setFaved] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler";
  const userEmail = user?.email || "";
  const userPhone = user?.user_metadata?.phone || "";

  const handleGenerate = useCallback(
    async (data: { destination: string; days: number; budget: string; preferences: string[] }) => {
      setIsLoading(true);
      setError("");
      setSaved(false);
      setFaved(false);

      try {
        const res = await fetch("/api/trip/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to generate trip plan");
        }

        const result = await res.json();
        setTripResult(result);

        // Check if already favorited
        setFaved(isFavorite(result.destination, result.days, result.budget));

        // Auto-set calendar dates
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 14);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + data.days - 1);
        setSelectedDates({ from: startDate, to: endDate });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSave = () => {
    if (!tripResult || saved) return;
    saveTrip({
      destination: tripResult.destination,
      days: tripResult.days,
      budget: tripResult.budget,
      preferences: tripResult.preferences,
      summary: tripResult.summary,
      itinerary: tripResult.itinerary,
      tips: tripResult.tips,
      total_cost_estimate: tripResult.total_cost_estimate,
      hotels: tripResult.hotels,
    });
    setSaved(true);
  };

  const handleFav = () => {
    if (!tripResult) return;
    const result = toggleFavorite({
      destination: tripResult.destination,
      days: tripResult.days,
      budget: tripResult.budget,
      preferences: tripResult.preferences,
      summary: tripResult.summary,
      itinerary: tripResult.itinerary,
      tips: tripResult.tips,
      total_cost_estimate: tripResult.total_cost_estimate,
      hotels: tripResult.hotels,
    });
    setFaved(result);
  };

  return (
    <div className="flex w-full h-full p-4 lg:p-6 gap-4 lg:gap-6 bg-[var(--bg-primary)] overflow-hidden transition-colors duration-300">
      {/* Left Column — Form */}
      <div className="w-[320px] flex flex-col gap-4 flex-shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border)] p-5 shadow-2xl relative transition-colors">
          <div className="absolute top-0 left-10 w-20 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-b-full opacity-50"></div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1 mt-1">Plan Your Trip ✨</h2>
          <p className="text-[11px] text-[var(--text-muted)] mb-5">Choose your preferences and let AI craft the perfect itinerary</p>
          <TripForm
            initialDestination={destination}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}
        </div>

        <CalendarWidget
          selectedRange={selectedDates}
          onRangeChange={setSelectedDates}
          tripDays={tripResult?.days}
        />
      </div>

      {/* Center Column — Itinerary */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
              {tripResult ? `Trip to ${tripResult.destination} ✈️` : "WanderAI Planner 🌍"}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {tripResult
                ? `${tripResult.days}-day ${tripResult.budget} trip`
                : "Fill in the form and generate your AI-powered itinerary"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Save + Fav buttons */}
            {tripResult && (
              <>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                    saved
                      ? "bg-green-500/15 border-green-500/30 text-green-400"
                      : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-orange-500/30"
                  }`}
                >
                  {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {saved ? "Saved" : "Save"}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFav}
                  className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                    faved
                      ? "bg-pink-500/15 border-pink-500/30 text-pink-400"
                      : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-pink-500/30"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${faved ? "fill-pink-400" : ""}`} />
                  {faved ? "Favourited" : "Favourite"}
                </motion.button>
              </>
            )}

            {/* Map toggle */}
            {tripResult && tripResult.hotels?.length > 0 && (
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  showMap
                    ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text-primary)]"
                }`}
              >
                {showMap ? "📋 Itinerary" : "🗺️ Map"}
              </button>
            )}

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 bg-[var(--bg-card)] rounded-full pl-2 pr-4 py-1.5 border border-[var(--border)] shadow-md hover:border-orange-500/30 transition-all"
              >
                <div
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm"
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm text-left">
                  <p className="font-semibold text-[var(--text-primary)] leading-none">{userName}</p>
                  <p className="text-[11px] text-orange-400 font-medium mt-1">Traveler Pro</p>
                </div>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute top-14 right-0 w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 shadow-2xl z-50"
                  >
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-2.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                        <User className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold">Name</p>
                          <p className="text-xs text-[var(--text-primary)] font-medium truncate">{userName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                        <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold">Email</p>
                          <p className="text-xs text-[var(--text-primary)] font-medium truncate">{userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                        <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold">Phone</p>
                          <p className="text-xs text-[var(--text-primary)] font-medium truncate">{userPhone || "Not set"}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-500/20 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-[var(--bg-card)] rounded-[2rem] border border-[var(--border)] p-5 flex-1 overflow-hidden flex flex-col shadow-2xl relative transition-colors">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          {showMap && tripResult?.hotels?.length ? (
            <HotelMapView
              hotels={tripResult.hotels}
              center={{ lat: tripResult.center_lat, lng: tripResult.center_lng }}
            />
          ) : tripResult ? (
            <ItineraryView
              destination={tripResult.destination}
              days={tripResult.days}
              budget={tripResult.budget}
              summary={tripResult.summary}
              itinerary={tripResult.itinerary}
              tips={tripResult.tips}
              total_cost_estimate={tripResult.total_cost_estimate}
              cached={tripResult.cached}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 z-10 relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500/20 to-pink-500/10 flex items-center justify-center border border-orange-500/10">
                <span className="text-4xl">🗺️</span>
              </div>
              <div className="text-center">
                <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-1">Ready to explore?</h3>
                <p className="text-[var(--text-muted)] text-sm max-w-[280px]">
                  Pick your destination, choose your preferences, and let AI create a personalized day-by-day travel plan.
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                {["🏖️ Beach", "🏔️ Mountains", "🏛️ City", "🌿 Nature"].map((tag) => (
                  <span key={tag} className="text-[11px] px-3 py-1.5 rounded-full bg-[var(--hover)] border border-[var(--border)] text-[var(--text-secondary)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Hotels */}
      <div className="w-[320px] flex flex-col gap-4 flex-shrink-0 overflow-hidden">
        <TripPlanView
          hotels={tripResult?.hotels || []}
          isLoading={isLoading}
          destination={tripResult?.destination || destination}
          onToggleMap={() => setShowMap(!showMap)}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full bg-[var(--bg-primary)]">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
