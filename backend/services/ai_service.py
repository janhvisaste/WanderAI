"""
AI Service — OpenRouter (primary) + Groq (fallback) with in-memory TTL cache.
Generates structured day-wise itineraries using free LLM models.
"""
import os
import json
import time
import hashlib
from typing import Optional
from dotenv import load_dotenv
import httpx

from models.schemas import (
    TripGenerateRequest,
    TripGenerateResponse,
    ItineraryDayV2,
    ItineraryActivity,
    TripTip,
)

load_dotenv()

# ── In-memory TTL cache ────────────────────────────────────────
_cache: dict[str, tuple[float, TripGenerateResponse]] = {}
CACHE_TTL_SECONDS = 3600  # 1 hour


def _cache_key(req: TripGenerateRequest) -> str:
    """Create deterministic cache key from request params."""
    key_data = f"{req.destination.lower().strip()}|{req.days}|{req.budget.lower().strip()}|{'|'.join(sorted(p.lower() for p in req.preferences))}"
    return hashlib.md5(key_data.encode()).hexdigest()


def _get_cached(key: str) -> Optional[TripGenerateResponse]:
    """Return cached response if valid, else None."""
    if key in _cache:
        ts, response = _cache[key]
        if time.time() - ts < CACHE_TTL_SECONDS:
            response.cached = True
            return response
        del _cache[key]
    return None


def _set_cache(key: str, response: TripGenerateResponse):
    """Store response in cache."""
    response.cached = False
    _cache[key] = (time.time(), response)


# ── Prompt template ────────────────────────────────────────────
ITINERARY_PROMPT = """You are WanderAI, an expert travel planner. Generate a detailed {days}-day travel itinerary for {destination}.

TRIP DETAILS:
- Duration: {days} days
- Budget: {budget}
- Preferences: {preferences}

OUTPUT INSTRUCTIONS:
Return ONLY valid JSON (no markdown, no explanation, just the JSON object) with this exact structure:
{{
  "summary": "2-3 sentence exciting trip summary",
  "total_cost_estimate": "e.g. $500-$800 total",
  "itinerary": [
    {{
      "day": 1,
      "title": "Day title",
      "description": "1 very short sentence overview",
      "daily_cost_estimate": "e.g. $80-$120",
      "image_query": "search query for day photo",
      "activities": [
        {{
          "time": "morning",
          "title": "Activity name",
          "description": "1 short sentence about what to do",
          "estimated_cost": "$0-$20",
          "icon": "🏛️"
        }},
        {{
          "time": "afternoon",
          "title": "Activity name",
          "description": "1-2 sentences",
          "estimated_cost": "$10-$30",
          "icon": "🍜"
        }},
        {{
          "time": "evening",
          "title": "Activity name",
          "description": "1-2 sentences",
          "estimated_cost": "$15-$40",
          "icon": "🌃"
        }}
      ]
    }}
  ],
  "tips": [
    {{
      "category": "transport",
      "tip": "Practical tip text",
      "icon": "🚕"
    }},
    {{
      "category": "food",
      "tip": "Food recommendation",
      "icon": "🍜"
    }},
    {{
      "category": "safety",
      "tip": "Safety tip",
      "icon": "🛡️"
    }},
    {{
      "category": "packing",
      "tip": "What to pack",
      "icon": "🎒"
    }}
  ]
}}

Use real, well-known places and attractions in {destination}. Make activities specific with actual venue/restaurant/landmark names. Provide 3 activities per day (morning, afternoon, evening). Include 4-6 practical tips. Output ONLY the JSON."""


# ── API callers ────────────────────────────────────────────────
async def _call_openrouter(prompt: str) -> str:
    """Call OpenRouter with free LLaMA 3.3 70b model."""
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        raise Exception("OPENROUTER_API_KEY not set")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://wanderai.app",
                "X-Title": "WanderAI Trip Planner",
            },
            json={
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {"role": "system", "content": "You are an expert travel planner. Return ONLY valid JSON, no markdown fences, no explanation."},
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": 8000,
                "temperature": 0.7,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()


async def _call_groq(prompt: str) -> str:
    """Fallback: Call Groq with free LLaMA model."""
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise Exception("GROQ_API_KEY not set")

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are an expert travel planner. Return ONLY valid JSON, no markdown fences, no explanation."},
                    {"role": "user", "content": prompt},
                ],
                "max_tokens": 8000,
                "temperature": 0.7,
            },
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()


def _parse_json(text: str) -> dict:
    """Parse JSON from LLM response, handling markdown fences."""
    cleaned = text.strip()
    if "```json" in cleaned:
        cleaned = cleaned.split("```json")[1].split("```")[0].strip()
    elif "```" in cleaned:
        cleaned = cleaned.split("```")[1].split("```")[0].strip()
    return json.loads(cleaned)


def _build_response(data: dict, req: TripGenerateRequest) -> TripGenerateResponse:
    """Convert parsed JSON to structured response."""
    itinerary = []
    for day_data in data.get("itinerary", []):
        activities = []
        for act in day_data.get("activities", []):
            activities.append(ItineraryActivity(
                time=act.get("time", "morning"),
                title=act.get("title", ""),
                description=act.get("description", ""),
                estimated_cost=act.get("estimated_cost", ""),
                icon=act.get("icon", "📍"),
            ))
        itinerary.append(ItineraryDayV2(
            day=day_data.get("day", 0),
            title=day_data.get("title", ""),
            description=day_data.get("description", ""),
            activities=activities,
            daily_cost_estimate=day_data.get("daily_cost_estimate", ""),
            image_query=day_data.get("image_query", ""),
        ))

    tips = []
    for tip_data in data.get("tips", []):
        tips.append(TripTip(
            category=tip_data.get("category", ""),
            tip=tip_data.get("tip", ""),
            icon=tip_data.get("icon", "💡"),
        ))

    return TripGenerateResponse(
        destination=req.destination,
        days=req.days,
        budget=req.budget,
        preferences=req.preferences,
        summary=data.get("summary", ""),
        itinerary=itinerary,
        tips=tips,
        total_cost_estimate=data.get("total_cost_estimate", ""),
        cached=False,
    )


# ── Main entry point ──────────────────────────────────────────
async def generate_trip(req: TripGenerateRequest) -> TripGenerateResponse:
    """
    Generate a trip itinerary. Checks cache first, then tries OpenRouter,
    falls back to Groq if OpenRouter fails.
    """
    # 1. Check cache
    key = _cache_key(req)
    cached = _get_cached(key)
    if cached:
        return cached

    # 2. Build prompt
    prefs_str = ", ".join(req.preferences) if req.preferences else "general sightseeing"
    prompt = ITINERARY_PROMPT.format(
        destination=req.destination,
        days=req.days,
        budget=req.budget,
        preferences=prefs_str,
    )

    # 3. Try OpenRouter first, fallback to Groq
    raw_text = ""
    errors = []

    try:
        raw_text = await _call_openrouter(prompt)
    except Exception as e:
        errors.append(f"OpenRouter: {str(e)}")
        try:
            raw_text = await _call_groq(prompt)
        except Exception as e2:
            errors.append(f"Groq: {str(e2)}")
            raise Exception(f"All AI providers failed. Errors: {'; '.join(errors)}")

    # 4. Parse response
    try:
        data = _parse_json(raw_text)
    except json.JSONDecodeError:
        # Retry with Groq if OpenRouter gave bad JSON
        if "OpenRouter" not in str(errors):
            try:
                raw_text = await _call_groq(prompt)
                data = _parse_json(raw_text)
            except Exception:
                raise Exception(f"Failed to parse AI response as JSON. Raw: {raw_text[:200]}")
        else:
            raise Exception(f"Failed to parse AI response as JSON. Raw: {raw_text[:200]}")

    # 5. Build structured response
    response = _build_response(data, req)

    # 6. Cache it
    _set_cache(key, response)

    return response
