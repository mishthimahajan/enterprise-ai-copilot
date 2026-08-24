import os
from typing import List, Dict

from dotenv import load_dotenv
from google import genai


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from backend/.env"
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def generate_answer(
    question: str,
    context: List[Dict],
    history: List[Dict] | None = None,
) -> str:

    if not question.strip():
        return "Please enter a question."

    if not context:
        return (
            "I couldn't find relevant information "
            "in the selected documents."
        )

    history = history or []

    # ---------------------------------------
    # Build document context
    # ---------------------------------------

    context_parts = []

    for index, item in enumerate(context, start=1):

        text = (
            item.get("text")
            or item.get("content")
            or ""
        )

        filename = (
            item.get("filename")
            or item.get("source")
            or "Unknown document"
        )

        if not text:
            continue

        context_parts.append(
            f"""
SOURCE {index}
Document: {filename}

{text}
""".strip()
        )

    if not context_parts:
        return (
            "Relevant documents were found, "
            "but no readable text was available."
        )

    context_text = "\n\n".join(context_parts)

    # ---------------------------------------
    # Conversation history
    # ---------------------------------------

    history_parts = []

    for message in history[-6:]:

        role = message.get("role", "user")
        content = message.get("content", "")

        if content:
            history_parts.append(
                f"{role.upper()}: {content}"
            )

    history_text = "\n".join(history_parts)

    # ---------------------------------------
    # RAG prompt
    # ---------------------------------------

    prompt = f"""
You are an Enterprise AI Copilot.

Answer the user's question using only the
provided document context.

RULES:

1. Use only information supported by the documents.
2. Do not invent information.
3. If the answer cannot be found, say:
   "I couldn't find that information in the selected documents."
4. Give a clear and concise answer.
5. Do not mention Qdrant, embeddings, vectors,
   chunks, or internal implementation details.
6. Conversation history is only for understanding
   follow-up questions.

CONVERSATION HISTORY:

{history_text if history_text else "No previous conversation."}

DOCUMENT CONTEXT:

{context_text}

USER QUESTION:

{question}

ANSWER:
""".strip()

    try:

        print("Sending RAG context to Gemini...")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        answer = response.text

        if not answer:
            raise RuntimeError(
                "Gemini returned an empty response."
            )

        print("Gemini answer generated successfully.")

        return answer.strip()

    except Exception as error:

        print(
            "GEMINI ERROR:",
            repr(error)
        )

        raise