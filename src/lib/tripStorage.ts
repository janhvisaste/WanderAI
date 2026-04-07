/**
 * Trip Storage — localStorage-based save/favorite system.
 */

export type SavedTrip = {
  id: string;
  destination: string;
  days: number;
  budget: string;
  preferences: string[];
  summary: string;
  itinerary: any[];
  tips: any[];
  total_cost_estimate: string;
  hotels: any[];
  savedAt: string;
};

const TRIPS_KEY = "wanderai_trips";
const FAVS_KEY = "wanderai_favorites";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Saved Trips ───────────────────────────────────────────────
export function saveTrip(trip: Omit<SavedTrip, "id" | "savedAt">): SavedTrip {
  const saved: SavedTrip = {
    ...trip,
    id: generateId(),
    savedAt: new Date().toISOString(),
  };
  const trips = getTrips();
  trips.unshift(saved);
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  return saved;
}

export function getTrips(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(TRIPS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function deleteTrip(id: string) {
  const trips = getTrips().filter((t) => t.id !== id);
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

// ── Favourites ────────────────────────────────────────────────
export function toggleFavorite(trip: Omit<SavedTrip, "id" | "savedAt">): boolean {
  const favs = getFavorites();
  const exists = favs.find(
    (f) => f.destination === trip.destination && f.days === trip.days && f.budget === trip.budget
  );
  if (exists) {
    const updated = favs.filter((f) => f.id !== exists.id);
    localStorage.setItem(FAVS_KEY, JSON.stringify(updated));
    return false; // unfavorited
  } else {
    const saved: SavedTrip = {
      ...trip,
      id: generateId(),
      savedAt: new Date().toISOString(),
    };
    favs.unshift(saved);
    localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
    return true; // favorited
  }
}

export function getFavorites(): SavedTrip[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function isFavorite(destination: string, days: number, budget: string): boolean {
  return getFavorites().some(
    (f) => f.destination === destination && f.days === days && f.budget === budget
  );
}

export function removeFavorite(id: string) {
  const favs = getFavorites().filter((f) => f.id !== id);
  localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
}
