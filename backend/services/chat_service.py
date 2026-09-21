# import os
# from typing import List, Dict

# from dotenv import load_dotenv
# from google import genai


# load_dotenv()


# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise RuntimeError(
#         "GEMINI_API_KEY is missing from backend/.env"
#     )


# client = genai.Client(
#     api_key=GEMINI_API_KEY
# )


# def generate_answer(
#     question: str,
#     context: List[Dict],
#     history: List[Dict] | None = None,
# ) -> str:

#     if not question.strip():
#         return "Please enter a question."

#     if not context:
#         return (
#             "I couldn't find relevant information "
#             "in the selected documents."
#         )

#     history = history or []

  

#     context_parts = []

#     for index, item in enumerate(context, start=1):

#         text = (
#             item.get("text")
#             or item.get("content")
#             or ""
#         )

#         filename = (
#             item.get("filename")
#             or item.get("source")
#             or "Unknown document"
#         )

#         if not text:
#             continue

#         context_parts.append(
#             f"""
# SOURCE {index}
# Document: {filename}

# {text}
# """.strip()
#         )

#     if not context_parts:
#         return (
#             "Relevant documents were found, "
#             "but no readable text was available."
#         )

#     context_text = "\n\n".join(context_parts)

  

#     history_parts = []

#     for message in history[-6:]:

#         role = message.get("role", "user")
#         content = message.get("content", "")

#         if content:
#             history_parts.append(
#                 f"{role.upper()}: {content}"
#             )

#     history_text = "\n".join(history_parts)

 
#     prompt = f"""
# You are an Enterprise AI Copilot.

# Answer the user's question using only the
# provided document context.

# RULES:

# 1. Use only information supported by the documents.
# 2. Do not invent information.
# 3. If the answer cannot be found, say:
#    "I couldn't find that information in the selected documents."
# 4. Give a clear and concise answer.
# 5. Do not mention Qdrant, embeddings, vectors,
#    chunks, or internal implementation details.
# 6. Conversation history is only for understanding
#    follow-up questions.

# CONVERSATION HISTORY:

# {history_text if history_text else "No previous conversation."}

# DOCUMENT CONTEXT:

# {context_text}

# USER QUESTION:

# {question}

# ANSWER:
# """.strip()

#     try:

#         print("Sending RAG context to Gemini...")

#         response = client.models.generate_content(
#             model="gemini-3.6-flash",
#             contents=prompt,
#         )

#         answer = response.text

#         if not answer:
#             raise RuntimeError(
#                 "Gemini returned an empty response."
#             )

#         print("Gemini answer generated successfully.")

#         return answer.strip()

#     except Exception as error:

#         print(
#             "GEMINI ERROR:",
#             repr(error)
#         )

#         raise

import os
import random
import time
from typing import List, Dict

from dotenv import load_dotenv
from google import genai
from google.genai import errors


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from the backend environment."
    )


client = genai.Client(api_key=GEMINI_API_KEY)


# A dedicated exception lets the FastAPI endpoint
# distinguish a temporary AI outage from other failures.
class GeminiTemporarilyUnavailable(Exception):
    pass


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

    # ------------------------------------------
    # Prepare retrieved document context
    # ------------------------------------------

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

    # ------------------------------------------
    # Prepare conversation history
    # ------------------------------------------

    history_parts = []

    for message in history[-6:]:

        role = message.get("role", "user")
        content = message.get("content", "")

        if content:
            history_parts.append(
                f"{role.upper()}: {content}"
            )

    history_text = "\n".join(history_parts)

    # ------------------------------------------
    # Build grounded RAG prompt
    # ------------------------------------------

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

    # ------------------------------------------
    # Generate answer with bounded retries
    # ------------------------------------------

    max_attempts = 3

    for attempt in range(max_attempts):

        try:

            print(
                f"Sending RAG context to Gemini "
                f"(attempt {attempt + 1}/{max_attempts})...",
                flush=True,
            )

            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
            )

            answer = response.text

            if not answer or not answer.strip():
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            print(
                "Gemini answer generated successfully.",
                flush=True,
            )

            return answer.strip()

        except errors.ServerError as error:

            status_code = getattr(error, "code", None)

            # Retry only the temporary 503 failure
            # confirmed in your Render logs.
            if status_code != 503:
                print(
                    "GEMINI SERVER ERROR:",
                    repr(error),
                    flush=True,
                )
                raise

            # All attempts have been exhausted.
            if attempt == max_attempts - 1:

                print(
                    "Gemini remained unavailable "
                    "after all retry attempts.",
                    flush=True,
                )

                raise GeminiTemporarilyUnavailable(
                    "The AI model is temporarily busy. "
                    "Please try again shortly."
                ) from error

            # Exponential backoff with jitter:
            # approximately 2–3 seconds, then 4–5 seconds.
            delay = (
                2 ** (attempt + 1)
                + random.uniform(0, 1)
            )

            print(
                f"Gemini returned 503. "
                f"Retrying in {delay:.1f} seconds...",
                flush=True,
            )

            time.sleep(delay)

        except Exception as error:

            print(
                "GEMINI ERROR:",
                repr(error),
                flush=True,
            )

            raise

    # Defensive fallback; the loop should always
    # return or raise before reaching this line.
    raise GeminiTemporarilyUnavailable(
        "The AI model is temporarily unavailable."
    )