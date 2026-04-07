import os
import json
import uuid
import time
from typing import Optional
from dotenv import load_dotenv
import google.generativeai as genai

from models.schemas import (
    ConversationPhase,
    ChatStartResponse,
    ChatResponse,
    TripPlan,
    ItineraryDay,
)

load_dotenv()

# ── Rate limiting ──────────────────────────────────────────────
MAX_REQUESTS_PER_MINUTE = 12  # Stay well under free-tier limit (15 RPM)
_request_timestamps: list[float] = []


def _rate_limit_check():
    """Simple sliding-window rate limiter."""
    now = time.time()
    global _request_timestamps
    _request_timestamps = [t for t in _request_timestamps if now - t < 60]
    if len(_request_timestamps) >= MAX_REQUESTS_PER_MINUTE:
        raise Exception("Rate limit reached. Please wait a moment before sending another message.")
    _request_timestamps.append(now)


# ── Session store (in-memory) ──────────────────────────────────
_sessions: dict[str, dict] = {}

SYSTEM_PROMPT = """You are WanderAI, a friendly, expert AI travel planner. You help users plan their dream trips.

RULES:
- Be warm, enthusiastic, and concise (2-3 short paragraphs max per response).
- Use emojis sparingly for warmth (✈️ 🌴 🏔️ 🍜 etc.).
- When generating an itinerary, output ONLY valid JSON matching the schema below. No extra text before or after the JSON.
- For hotel recommendations, output ONLY valid JSON matching the hotel schema. No extra text.
- Always suggest real, well-known places and attractions.
- Keep responses short to conserve API tokens.

ITINERARY JSON SCHEMA (use when generating the final plan):
{
  "destination": "string",
  "duration_days": number,
  "trip_type": "string",
  "interests": ["string"],
  "budget": "string",
  "summary": "A 2-3 sentence exciting summary of the trip",
  "itinerary": [
    {
      "day": number,
      "title": "Day title",
      "description": "Brief day description",
      "activities": ["activity 1", "activity 2", "activity 3"],
      "image_query": "search query for a photo representing this day"
    }
  ]
}
"""

PHASE_PROMPTS = {
    ConversationPhase.ASK_DURATION: "The user wants to visit {destination}. Ask them how many days they want to spend there. Be enthusiastic about their choice! Keep it to 2-3 sentences max.",
    ConversationPhase.ASK_TYPE: "The user wants a {duration}-day trip to {destination}. Ask what type of trip they want: relaxing staycation, adventurous vacation, cultural exploration, romantic getaway, family-friendly, or backpacking. Keep it brief and fun.",
    ConversationPhase.ASK_INTERESTS: "The user wants a {type} trip to {destination} for {duration} days. Ask about their specific interests: food/cuisine, nature/hiking, historical sites, nightlife, shopping, photography, water sports, wellness/spa. Suggest they can pick multiple. Keep it concise.",
    ConversationPhase.ASK_BUDGET: "The user's trip: {destination}, {duration} days, {type}, interests: {interests}. Ask about their budget range: budget-friendly, mid-range, or luxury. One short paragraph.",
    ConversationPhase.GENERATING_PLAN: """Create a detailed day-by-day itinerary for this trip:
- Destination: {destination}
- Duration: {duration} days
- Type: {type}
- Interests: {interests}
- Budget: {budget}

Output ONLY the JSON object following the ITINERARY JSON SCHEMA from your system instructions. No markdown, no explanation, just the JSON.""",
}


def _get_model():
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise Exception("GEMINI_API_KEY not set. Please add your key to backend/.env")
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=1500,
            temperature=0.8,
        ),
        system_instruction=SYSTEM_PROMPT,
    )


def _build_chat_history(session: dict) -> list[dict]:
    """Convert session history to Gemini chat format."""
    history = []
    for msg in session.get("history", []):
        history.append({
            "role": msg["role"],
            "parts": [msg["content"]],
        })
    return history


async def start_session(destination: str = "") -> ChatStartResponse:
    session_id = str(uuid.uuid4())
    session = {
        "id": session_id,
        "destination": destination,
        "duration": "",
        "trip_type": "",
        "interests": [],
        "budget": "",
        "phase": ConversationPhase.GREETING,
        "history": [],
        "trip_plan": None,
    }

    if destination:
        # User came from landing page with a destination pre-selected
        session["phase"] = ConversationPhase.ASK_DURATION
        _rate_limit_check()
        model = _get_model()
        prompt = PHASE_PROMPTS[ConversationPhase.ASK_DURATION].format(destination=destination)
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        msg = response.text
        session["history"] = [
            {"role": "user", "content": f"I want to visit {destination}"},
            {"role": "model", "content": msg},
        ]
    else:
        msg = "Hey there, fellow adventurer! ✈️ I'm your AI travel planner. Tell me — where in the world would you love to go? Or describe the kind of experience you're dreaming of, and I'll suggest perfect destinations!"
        session["history"] = [
            {"role": "model", "content": msg},
        ]

    _sessions[session_id] = session
    return ChatStartResponse(session_id=session_id, message=msg, phase=session["phase"])


async def chat(session_id: str, user_message: str) -> ChatResponse:
    session = _sessions.get(session_id)
    if not session:
        raise Exception("Session not found. Please start a new conversation.")

    # Add user message to history
    session["history"].append({"role": "user", "content": user_message})

    current_phase = session["phase"]
    suggestions: list[str] = []
    trip_plan: Optional[TripPlan] = None

    _rate_limit_check()
    model = _get_model()

    # ── Phase transitions ──────────────────────────────────────
    if current_phase == ConversationPhase.GREETING:
        # User just said where they want to go
        session["destination"] = user_message
        session["phase"] = ConversationPhase.ASK_DURATION
        prompt = PHASE_PROMPTS[ConversationPhase.ASK_DURATION].format(destination=user_message)
        suggestions = ["3 days", "5 days", "7 days", "10 days", "2 weeks"]

    elif current_phase == ConversationPhase.ASK_DURATION:
        session["duration"] = user_message
        session["phase"] = ConversationPhase.ASK_TYPE
        prompt = PHASE_PROMPTS[ConversationPhase.ASK_TYPE].format(
            destination=session["destination"], duration=user_message
        )
        suggestions = ["Relaxing staycation", "Adventure vacation", "Cultural exploration", "Romantic getaway", "Family trip", "Backpacking"]

    elif current_phase == ConversationPhase.ASK_TYPE:
        session["trip_type"] = user_message
        session["phase"] = ConversationPhase.ASK_INTERESTS
        prompt = PHASE_PROMPTS[ConversationPhase.ASK_INTERESTS].format(
            destination=session["destination"],
            duration=session["duration"],
            type=user_message,
        )
        suggestions = ["Food & Cuisine", "Nature & Hiking", "Historical Sites", "Nightlife", "Shopping", "Photography", "Water Sports", "Wellness & Spa"]

    elif current_phase == ConversationPhase.ASK_INTERESTS:
        session["interests"] = [i.strip() for i in user_message.split(",")]
        session["phase"] = ConversationPhase.ASK_BUDGET
        prompt = PHASE_PROMPTS[ConversationPhase.ASK_BUDGET].format(
            destination=session["destination"],
            duration=session["duration"],
            type=session["trip_type"],
            interests=user_message,
        )
        suggestions = ["Budget-friendly 💰", "Mid-range 💎", "Luxury ✨"]

    elif current_phase == ConversationPhase.ASK_BUDGET:
        session["budget"] = user_message
        session["phase"] = ConversationPhase.GENERATING_PLAN
        prompt = PHASE_PROMPTS[ConversationPhase.GENERATING_PLAN].format(
            destination=session["destination"],
            duration=session["duration"],
            type=session["trip_type"],
            interests=", ".join(session["interests"]),
            budget=user_message,
        )

    elif current_phase in (ConversationPhase.PLAN_READY, ConversationPhase.FREE_CHAT):
        session["phase"] = ConversationPhase.FREE_CHAT
        prompt = f"The user has a trip plan to {session['destination']}. They ask: \"{user_message}\". Answer helpfully and concisely about their trip."

    else:
        prompt = user_message

    # ── Send to Gemini ─────────────────────────────────────────
    chat_history = _build_chat_history(session)
    # For generating plan, use fresh chat to avoid token waste
    if session["phase"] == ConversationPhase.GENERATING_PLAN:
        gemini_chat = model.start_chat(history=[])
    else:
        gemini_chat = model.start_chat(history=chat_history[:-1])  # Exclude latest user msg

    response = gemini_chat.send_message(prompt)
    ai_text = response.text.strip()

    # ── Parse itinerary if plan was generated ──────────────────
    if session["phase"] == ConversationPhase.GENERATING_PLAN:
        try:
            # Clean JSON from possible markdown wrapping
            json_text = ai_text
            if "```json" in json_text:
                json_text = json_text.split("```json")[1].split("```")[0].strip()
            elif "```" in json_text:
                json_text = json_text.split("```")[1].split("```")[0].strip()

            plan_data = json.loads(json_text)
            trip_plan = TripPlan(
                destination=plan_data.get("destination", session["destination"]),
                duration_days=int(plan_data.get("duration_days", 0)),
                trip_type=plan_data.get("trip_type", session["trip_type"]),
                interests=plan_data.get("interests", session["interests"]),
                budget=plan_data.get("budget", session["budget"]),
                summary=plan_data.get("summary", ""),
                itinerary=[ItineraryDay(**day) for day in plan_data.get("itinerary", [])],
            )
            session["trip_plan"] = trip_plan.model_dump()
            session["phase"] = ConversationPhase.PLAN_READY

            # Build a friendly message with the summary
            ai_text = f"🎉 Your trip plan is ready!\n\n{trip_plan.summary}\n\nI've created a detailed {trip_plan.duration_days}-day itinerary for your {trip_plan.trip_type} in **{trip_plan.destination}**. Check out the plan on the right! You can also browse recommended hotels. Feel free to ask me anything about your trip!"
            suggestions = ["Show me hotels", "Any restaurant tips?", "What should I pack?", "Local transport options?"]

        except (json.JSONDecodeError, Exception) as e:
            # If JSON parsing fails, return the raw text and stay in generating phase
            session["phase"] = ConversationPhase.PLAN_READY
            ai_text = f"✨ Here's your trip plan!\n\n{ai_text}\n\nFeel free to ask follow-up questions!"
            suggestions = ["Tell me more", "Show me hotels", "Any tips?"]

    # Add AI response to history
    session["history"].append({"role": "model", "content": ai_text})
    _sessions[session_id] = session

    return ChatResponse(
        session_id=session_id,
        message=ai_text,
        phase=session["phase"],
        trip_plan=TripPlan(**session["trip_plan"]) if session.get("trip_plan") else trip_plan,
        suggestions=suggestions,
    )


def get_session(session_id: str) -> Optional[dict]:
    return _sessions.get(session_id)
