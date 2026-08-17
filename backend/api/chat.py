from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.chat_service import generate_answer


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):

    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )

    try:

        

        context = []

        answer = generate_answer(
            question=question,
            context=context,
        )

        return {
            "answer": answer
        }

    except Exception as e:

        print("CHAT ERROR:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to process chat request",
        )