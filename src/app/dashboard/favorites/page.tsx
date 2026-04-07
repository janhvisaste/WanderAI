"use client";
import { useState, useEffect } from "react";
import { getFavorites, removeFavorite, SavedTrip } from "@/lib/tripStorage";
import { MapPin, Calendar, DollarSign, HeartOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<SavedTrip[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  return (
    <div className="p-6 lg:p-8 bg-[var(--bg-primary)] min-h-full transition-colors">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Favourites ❤️</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Your favourite trip plans</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">💝</span>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">No favourites yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-4">Heart a trip plan to add it here!</p>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium text-sm hover:bg-orange-400 transition"
          >
            Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-5 hover:border-pink-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {trip.destination}
                </h3>
                <button
                  onClick={() => handleRemove(trip.id)}
                  className="text-pink-400 hover:text-pink-300 transition"
                  title="Remove from favourites"
                >
                  <HeartOff className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{trip.summary}</p>

              <div className="flex items-center gap-3 text-[10px] font-medium text-[var(--text-muted)]">
                <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border)]">
                  <Calendar className="w-3 h-3" /> {trip.days} days
                </span>
                <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border)]">
                  <DollarSign className="w-3 h-3" /> {trip.budget}
                </span>
              </div>

              {trip.itinerary?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-1">Itinerary Preview</p>
                  {trip.itinerary.slice(0, 2).map((day: any) => (
                    <p key={day.day} className="text-[11px] text-[var(--text-secondary)] truncate">
                      Day {day.day}: {day.title}
                    </p>
                  ))}
                  {trip.itinerary.length > 2 && (
                    <p className="text-[10px] text-orange-400 mt-0.5">+{trip.itinerary.length - 2} more days</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
