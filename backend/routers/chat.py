from fastapi import APIRouter, HTTPException
from models.schemas import ChatStartRequest, ChatStartResponse, ChatRequest, ChatResponse
from services import gemini_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/start", response_model=ChatStartResponse)
async def start_chat(request: ChatStartRequest):
    """Start a new chat session, optionally with a pre-selected destination."""
    try:
        result = await gemini_service.start_session(destination=request.destination)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message in an existing chat session."""
    try:
        result = await gemini_service.chat(
            session_id=request.session_id,
            user_message=request.message,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
