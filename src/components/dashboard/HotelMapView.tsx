"use client";
import { useEffect, useRef, useState } from "react";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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
  center: { lat: number; lng: number };
};

export default function HotelMapView({ hotels, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const tileLayerInstance = useRef<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const { theme } = useTheme();

  // Handle layer switching when theme changes
  useEffect(() => {
    if (tileLayerInstance.current) {
      const tileUrl = theme === "dark" 
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      tileLayerInstance.current.setUrl(tileUrl);
    }
  }, [theme]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Add CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Import Leaflet
      const L = (await import("leaflet")).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Create map
      const map = L.map(mapRef.current!, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([center.lat, center.lng], 12);

      // Tile layer logic based on current theme
      const tileUrl = theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OSM</a>',
        maxZoom: 19,
      }).addTo(map);
      
      tileLayerInstance.current = tileLayer;

      // Custom orange marker icon
      const orangeIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          background: linear-gradient(135deg, #f97316, #ea580c);
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(249,115,22,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        "><div style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">🏨</div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // Add markers for hotels
      const bounds: [number, number][] = [];
      hotels.forEach((hotel) => {
        if (hotel.latitude && hotel.longitude) {
          const marker = L.marker([hotel.latitude, hotel.longitude], {
            icon: orangeIcon,
          }).addTo(map);

          marker.bindPopup(`
            <div style="
              font-family: Inter, sans-serif;
              padding: 4px;
              min-width: 180px;
            ">
              <h4 style="margin: 0 0 4px 0; font-weight: 600; font-size: 13px; color: #1a1a1a;">
                ${hotel.name}
              </h4>
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                <span style="color: #f59e0b; font-size: 11px;">★</span>
                <span style="font-size: 11px; color: #666;">${hotel.rating}</span>
                <span style="margin-left: auto; font-weight: 700; color: #ea580c; font-size: 14px;">
                  $${hotel.price_per_night}
                </span>
                <span style="font-size: 10px; color: #999;">/night</span>
              </div>
              <a href="${hotel.booking_url}" target="_blank" style="
                display: block;
                text-align: center;
                background: #f97316;
                color: white;
                padding: 6px 12px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 11px;
                font-weight: 600;
                margin-top: 6px;
              ">Book Now →</a>
            </div>
          `);

          marker.on("click", () => setSelectedHotel(hotel));
          bounds.push([hotel.latitude, hotel.longitude]);
        }
      });

      // Fit bounds to show all markers
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      mapInstance.current = map;

    };

    loadLeaflet().catch(console.error);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [hotels, center]);

  return (
    <div className="flex-1 flex flex-col h-full z-10 relative rounded-2xl overflow-hidden">
      {/* Map header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)] z-20">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <h3 className="text-[var(--text-primary)] font-medium text-sm">
            Hotels on Map
          </h3>
          <span className="text-[10px] text-[var(--text-muted)] bg-[var(--hover)] px-2 py-0.5 rounded-full border border-[var(--border)]">
            {hotels.length} stays
          </span>
        </div>
      </div>

      {/* Map container */}
      <div ref={mapRef} className="flex-1 w-full relative z-10" />

      {/* Selected hotel card overlay */}
      {selectedHotel && (
        <div className="absolute bottom-4 left-4 right-4 bg-[var(--bg-card)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-4 z-30 shadow-2xl">
          <div className="flex gap-3">
            <img
              src={selectedHotel.image_url}
              alt={selectedHotel.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-[var(--text-primary)] font-semibold text-sm truncate">
                {selectedHotel.name}
              </h4>
              <p className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {selectedHotel.location}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-[var(--text-primary)] font-medium">
                    {selectedHotel.rating}
                  </span>
                </div>
                <span className="text-orange-400 font-bold text-sm">
                  ${selectedHotel.price_per_night}/night
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <a
                href={selectedHotel.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-400 text-white text-[10px] font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                Book <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => setSelectedHotel(null)}
                className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
