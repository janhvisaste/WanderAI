from fastapi import APIRouter, HTTPException
from models.schemas import HotelRequest, HotelResponse
from services import hotel_service

router = APIRouter(prefix="/api/hotels", tags=["hotels"])


@router.post("/", response_model=HotelResponse)
async def get_hotels(request: HotelRequest):
    """Get hotel recommendations for a destination."""
    try:
        result = await hotel_service.get_hotels(
            destination=request.destination,
            checkin_date=request.checkin_date,
            checkout_date=request.checkout_date,
            budget=request.budget,
            trip_type=request.trip_type,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
