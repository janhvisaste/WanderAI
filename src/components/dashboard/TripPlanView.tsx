"use client";
import { MapPin, Star, Heart, ArrowRight, Loader2 } from "lucide-react";
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

type Props = {
  hotels: Hotel[];
  isLoading: boolean;
  destination: string;
  onToggleMap: () => void;
};

export default function TripPlanView({
  hotels,
  isLoading,
  destination,
  onToggleMap,
}: Props) {
  return (
    <div className="flex-1 bg-[var(--bg-card)] rounded-[2rem] p-5 border border-[var(--border)] flex flex-col shadow-md overflow-hidden pb-2 relative transition-colors">
      <div className="absolute top-0 left-10 w-32 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-b-full opacity-50"></div>

      <div className="flex justify-between items-center mb-4 px-2 mt-1">
        <div>
          <h3 className="text-[var(--text-primary)] font-semibold text-lg flex items-center gap-2">
            Recommended Hotels
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {hotels.length > 0
              ? `${hotels.length} stays in ${destination}`
              : "Hotels appear after your plan is ready"}
          </p>
        </div>
        {hotels.length > 0 && (
          <button
            onClick={onToggleMap}
            className="text-xs text-orange-500 font-bold bg-orange-500/10 px-3 py-1.5 rounded-full cursor-pointer hover:bg-orange-500/20 transition"
          >
            🗺️ Map View
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
          </div>
          <p className="text-[var(--text-secondary)] text-sm">Finding the best hotels...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && hotels.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center">
            <MapPin className="w-7 h-7 text-[var(--text-muted)]" />
          </div>
          <p className="text-[var(--text-muted)] text-sm text-center max-w-[200px]">
            Generate a trip plan to get personalized hotel recommendations
          </p>
        </div>
      )}

      {/* Hotel cards */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence>
          {hotels.map((hotel, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-3 flex flex-col gap-3 group hover:border-orange-500/30 transition-colors shadow-sm"
            >
              {/* Image */}
              <div className="relative h-28 rounded-xl overflow-hidden bg-gray-800">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/20 transition text-white">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-semibold text-white">
                    {hotel.rating}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-[var(--text-primary)] font-medium text-sm leading-tight max-w-[60%] truncate">
                    {hotel.name}
                  </h4>
                  <div className="text-right">
                    <p className="text-[var(--text-primary)] font-bold text-sm leading-none">
                      ${hotel.price_per_night}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] mt-1 font-medium">
                      /night
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                  {hotel.location}
                </p>

                {/* Amenities */}
                {hotel.amenities.length > 0 && (
                  <div className="flex gap-1.5 mb-3">
                    {hotel.amenities.slice(0, 4).map((am, i) => (
                      <span
                        key={i}
                        className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--hover)] text-[var(--text-muted)] border border-[var(--border)]"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                )}

                {/* Book button */}
                <a
                  href={hotel.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[11px] font-bold py-2.5 rounded-xl hover:from-orange-400 hover:to-orange-500 transition-all flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(234,88,12,0.2)] uppercase tracking-wider"
                >
                  Book on Booking.com <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
