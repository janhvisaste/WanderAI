from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


# ── Conversation phases (kept for backward compat with chat) ───
class ConversationPhase(str, Enum):
    GREETING = "greeting"
    ASK_DURATION = "ask_duration"
    ASK_TYPE = "ask_type"
    ASK_INTERESTS = "ask_interests"
    ASK_BUDGET = "ask_budget"
    GENERATING_PLAN = "generating_plan"
    PLAN_READY = "plan_ready"
    FREE_CHAT = "free_chat"


# ── Chat schemas (backward compat) ────────────────────────────
class ChatStartRequest(BaseModel):
    destination: str = Field(default="", description="Pre-filled destination from landing page")


class ChatStartResponse(BaseModel):
    session_id: str
    message: str
    phase: ConversationPhase


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ItineraryDay(BaseModel):
    day: int
    title: str
    description: str
    activities: list[str] = []
    image_query: str = ""


class TripPlan(BaseModel):
    destination: str
    duration_days: int
    trip_type: str
    interests: list[str] = []
    budget: str = ""
    itinerary: list[ItineraryDay] = []
    summary: str = ""


class ChatResponse(BaseModel):
    session_id: str
    message: str
    phase: ConversationPhase
    trip_plan: Optional[TripPlan] = None
    suggestions: list[str] = []


# ── V2 Trip Generation schemas ─────────────────────────────────
class TripGenerateRequest(BaseModel):
    destination: str
    days: int = Field(ge=1, le=30, default=5)
    budget: str = Field(default="mid-range")  # budget, mid-range, luxury
    preferences: list[str] = Field(default_factory=list)  # food, nightlife, nature, adventure, culture, shopping, photography, wellness


class ItineraryActivity(BaseModel):
    time: str  # "morning", "afternoon", "evening"
    title: str
    description: str
    estimated_cost: str = ""
    icon: str = ""  # emoji


class ItineraryDayV2(BaseModel):
    day: int
    title: str
    description: str
    activities: list[ItineraryActivity] = []
    daily_cost_estimate: str = ""
    image_query: str = ""


class TripTip(BaseModel):
    category: str  # "transport", "food", "safety", "packing", etc.
    tip: str
    icon: str = ""


class TripGenerateResponse(BaseModel):
    destination: str
    days: int
    budget: str
    preferences: list[str] = []
    summary: str = ""
    itinerary: list[ItineraryDayV2] = []
    tips: list[TripTip] = []
    total_cost_estimate: str = ""
    cached: bool = False  # whether this was served from cache


# ── Hotel schemas ──────────────────────────────────────────────
class Hotel(BaseModel):
    name: str
    description: str
    location: str
    price_per_night: int
    rating: float
    amenities: list[str] = []
    image_url: str = ""
    latitude: float = 0.0
    longitude: float = 0.0
    booking_url: str = ""


class HotelRequest(BaseModel):
    destination: str
    checkin_date: str = ""
    checkout_date: str = ""
    budget: str = "mid-range"
    trip_type: str = "vacation"


class HotelResponse(BaseModel):
    hotels: list[Hotel] = []
    destination: str
    center_lat: float = 0.0
    center_lng: float = 0.0
