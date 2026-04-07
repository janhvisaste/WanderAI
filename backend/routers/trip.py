"""
Trip Router — /api/trip/generate endpoint.
Calls AI service + hotel service in parallel, merges results.
"""
from fastapi import APIRouter, HTTPException
from models.schemas import TripGenerateRequest, TripGenerateResponse, HotelResponse
from services import ai_service, hotel_service
import asyncio

router = APIRouter(prefix="/api/trip", tags=["trip"])


@router.post("/generate")
async def generate_trip(request: TripGenerateRequest):
    """
    Generate a complete trip plan: itinerary + hotel recommendations.
    Checks cache first, then calls AI + Hotels in parallel.
    """
    try:
        # Run AI itinerary + hotel fetch in parallel
        itinerary_task = ai_service.generate_trip(request)
        hotel_task = hotel_service.get_hotels(
            destination=request.destination,
            budget=request.budget,
        )

        results = await asyncio.gather(itinerary_task, hotel_task, return_exceptions=True)

        # Extract results
        itinerary_result = results[0]
        hotel_result = results[1]

        # Handle AI errors
        if isinstance(itinerary_result, Exception):
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(itinerary_result)}")

        # Handle hotel errors gracefully (non-blocking)
        hotels_data = None
        if isinstance(hotel_result, Exception):
            print(f"Hotel fetch failed (non-blocking): {hotel_result}")
        else:
            hotels_data = hotel_result

        # Build response
        response = {
            **itinerary_result.model_dump(),
        }

        if hotels_data:
            response["hotels"] = [h.model_dump() for h in hotels_data.hotels]
            response["center_lat"] = hotels_data.center_lat
            response["center_lng"] = hotels_data.center_lng
        else:
            response["hotels"] = []
            response["center_lat"] = 0
            response["center_lng"] = 0

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
