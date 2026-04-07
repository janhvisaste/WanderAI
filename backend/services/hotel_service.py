"""
Hotel Service — OSM Overpass API + Nominatim (fully free, no API key).
Pipeline: Nominatim (geocode city) → Overpass (fetch hotels) → Filter + Format → Frontend.
"""
import urllib.parse
from typing import Optional
import httpx

from models.schemas import Hotel, HotelResponse

# ── User-Agent (required by Nominatim TOS) ─────────────────────
USER_AGENT = "WanderAI/2.0 (travel-planner-app)"

# Curated hotel images (fallback since OSM doesn't have photos)
HOTEL_IMAGES = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
]

# Budget → star filter mapping
BUDGET_STARS = {
    "budget": [None, "1", "2"],        # Unrated + 1-2 star
    "mid-range": ["3", "4"],            # 3-4 star
    "luxury": ["4", "5"],               # 4-5 star
}


def _build_booking_url(hotel_name: str, destination: str) -> str:
    """Build a booking.com deep link."""
    query = f"{hotel_name} {destination}"
    params = {"ss": query, "lang": "en-us"}
    return f"https://www.booking.com/searchresults.html?{urllib.parse.urlencode(params)}"


async def _geocode_city(city: str) -> tuple[float, float]:
    """
    Step 1: Nominatim — convert city name → (lat, lng).
    Free, no API key. Rate limit: 1 req/sec.
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://nominatim.openstreetmap.org/search",
            params={
                "q": city,
                "format": "json",
                "limit": 1,
                "addressdetails": 0,
            },
            headers={"User-Agent": USER_AGENT},
        )
        response.raise_for_status()
        data = response.json()

    if not data:
        raise Exception(f"Could not geocode '{city}'. Try a more specific name.")

    return float(data[0]["lat"]), float(data[0]["lon"])


async def _fetch_osm_hotels(lat: float, lng: float, radius: int = 10000) -> list[dict]:
    """
    Step 2: Overpass API — fetch real hotels/lodging near coordinates.
    Free, no API key, global coverage.
    """
    # Overpass QL query for hotels, hostels, guest houses, resorts
    query = f"""
    [out:json][timeout:15];
    (
      node["tourism"="hotel"](around:{radius},{lat},{lng});
      node["tourism"="hostel"](around:{radius},{lat},{lng});
      node["tourism"="guest_house"](around:{radius},{lat},{lng});
      way["tourism"="hotel"](around:{radius},{lat},{lng});
      way["tourism"="hostel"](around:{radius},{lat},{lng});
    );
    out center body 20;
    """

    endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.osm.ch/api/interpreter",
    ]

    async with httpx.AsyncClient(timeout=15.0) as client:
        for endpoint in endpoints:
            try:
                response = await client.post(
                    endpoint,
                    data={"data": query},
                    headers={"User-Agent": USER_AGENT},
                )
                response.raise_for_status()
                data = response.json()
                return data.get("elements", [])
            except Exception as e:
                print(f"Overpass endpoint {endpoint} failed: {e}")
                continue
                
    raise Exception("All Overpass endpoints failed or timed out.")


def _filter_and_format(
    elements: list[dict],
    destination: str,
    budget: str,
) -> list[Hotel]:
    """
    Step 3: Filter + Format — clean OSM data, apply budget filter,
    build structured Hotel objects for the frontend.
    """
    target_stars = BUDGET_STARS.get(budget.lower(), ["3", "4"])
    hotels: list[Hotel] = []

    for i, el in enumerate(elements):
        tags = el.get("tags", {})
        name = tags.get("name", "")

        # Skip unnamed entries
        if not name:
            continue

        # Get coordinates (node vs way center)
        lat = el.get("lat") or el.get("center", {}).get("lat", 0)
        lng = el.get("lon") or el.get("center", {}).get("lon", 0)

        if not lat or not lng:
            continue

        # Extract OSM metadata
        stars = tags.get("stars", None)
        tourism_type = tags.get("tourism", "hotel")
        address_parts = []
        if tags.get("addr:street"):
            address_parts.append(tags["addr:street"])
        if tags.get("addr:city"):
            address_parts.append(tags["addr:city"])
        address = ", ".join(address_parts) if address_parts else destination

        # Budget filter: match star rating
        if stars and stars not in target_stars and None not in target_stars:
            continue

        # Estimate price from star rating and type
        if stars:
            star_num = int(stars)
            price = {1: 25, 2: 50, 3: 100, 4: 180, 5: 350}.get(star_num, 100)
        elif tourism_type == "hostel":
            price = 25
        elif tourism_type == "guest_house":
            price = 50
        else:
            price = {"budget": 40, "mid-range": 120, "luxury": 250}.get(budget.lower(), 100)

        # Build rating from stars or default
        rating = float(stars) if stars else (4.0 if tourism_type == "hotel" else 3.8)

        # Collect amenities from tags
        amenities = []
        if tags.get("internet_access") in ("yes", "wlan", "wifi"):
            amenities.append("WiFi")
        if tags.get("swimming_pool") == "yes":
            amenities.append("Pool")
        if tags.get("restaurant") == "yes" or tags.get("kitchen") == "yes":
            amenities.append("Restaurant")
        if tags.get("parking") in ("yes", "surface", "multi-storey"):
            amenities.append("Parking")
        if tags.get("air_conditioning") == "yes":
            amenities.append("AC")
        if not amenities:
            amenities = ["WiFi", "AC"]  # reasonable defaults

        # Type label
        type_label = {"hostel": "Hostel", "guest_house": "Guest House"}.get(tourism_type, "Hotel")
        desc = f"{type_label} in {destination}"
        if stars:
            desc = f"{stars}★ {desc}"

        hotels.append(Hotel(
            name=name,
            description=desc,
            location=address[:80],
            price_per_night=price,
            rating=min(rating, 5.0),
            amenities=amenities,
            image_url=HOTEL_IMAGES[len(hotels) % len(HOTEL_IMAGES)],
            latitude=float(lat),
            longitude=float(lng),
            booking_url=_build_booking_url(name, destination),
        ))

        # Cap at 8 results
        if len(hotels) >= 8:
            break

    return hotels


def _generate_mock_hotels(destination: str, budget: str, base_lat: float, base_lng: float) -> list[Hotel]:
    """Fallback generator for beautiful UI when OSM returns 0 hits (e.g., country-level ocean coords) or fails."""
    target_stars = BUDGET_STARS.get(budget.lower(), ["3", "4"])
    # If budget is luxury, pick 5 stars, etc.
    base_price = {"budget": 45, "mid-range": 150, "luxury": 450}.get(budget.lower(), 150)
    base_stars = {"budget": 2.5, "mid-range": 3.5, "luxury": 4.8}.get(budget.lower(), 3.5)
    
    names = [
        f"The {destination} Grand Resort",
        f"Central {destination} Boutique Hotel",
        f"Seaview {destination} Retreat",
        f"{destination} Heritage Inn",
        f"Luxe {destination} Suites",
    ]
    
    mock_hotels = []
    import random
    random.seed(destination + budget) # deterministic feeling
    
    for i, name in enumerate(names):
        price = base_price + random.randint(-20, 50)
        rating = min(5.0, base_stars + random.uniform(0.1, 0.4))
        amenities = ["WiFi", "AC", "Restaurant"]
        if budget == "luxury":
            amenities.extend(["Spa", "Pool", "Room Service"])
            
        mock_hotels.append(Hotel(
            name=name,
            description=f"Beautiful {'luxury ' if budget=='luxury' else ''}stay perfectly located in {destination}.",
            location=f"Downtown {destination}",
            price_per_night=price,
            rating=round(rating, 1),
            amenities=amenities,
            image_url=HOTEL_IMAGES[i % len(HOTEL_IMAGES)],
            latitude=base_lat + random.uniform(-0.02, 0.02) if base_lat != 0.0 else 0.0,
            longitude=base_lng + random.uniform(-0.02, 0.02) if base_lng != 0.0 else 0.0,
            booking_url=_build_booking_url(name, destination),
        ))
    return mock_hotels



async def get_hotels(
    destination: str,
    checkin_date: str = "",
    checkout_date: str = "",
    budget: str = "mid-range",
    trip_type: str = "vacation",
) -> HotelResponse:
    """
    Full pipeline:
    1. Nominatim: geocode destination → (lat, lng)
    2. Overpass: fetch OSM hotel data near coordinates
    3. Filter + Format: apply budget filter, build Hotel objects
    """
    try:
        # Step 1: Geocode
        lat, lng = await _geocode_city(destination)

        # Step 2: Fetch OSM hotels
        elements = await _fetch_osm_hotels(lat, lng)

        # Step 3: Filter + Format
        hotels = _filter_and_format(elements, destination, budget)

        # If OSM returned too few, widen search radius
        if len(hotels) < 3:
            elements = await _fetch_osm_hotels(lat, lng, radius=25000)
            hotels = _filter_and_format(elements, destination, budget)

        center_lat = lat
        center_lng = lng

        # Recenter on hotels if we have them from OSM
        if hotels:
            center_lat = sum(h.latitude for h in hotels) / len(hotels)
            center_lng = sum(h.longitude for h in hotels) / len(hotels)
        else:
            # Smart Fallback: OSM returned 0 hotels (likely ocean coordinates or empty area)
            hotels = _generate_mock_hotels(destination, budget, lat, lng)

        return HotelResponse(
            hotels=hotels,
            destination=destination,
            center_lat=center_lat,
            center_lng=center_lng,
        )

    except Exception as e:
        print(f"Hotel fetch failed: {e}")
        # Complete failover: Return mock hotels instead of empty list so UI doesn't break
        return HotelResponse(
            hotels=_generate_mock_hotels(destination, budget, 0.0, 0.0),
            destination=destination,
            center_lat=0.0,
            center_lng=0.0,
        )
