from typing import List,Dict

def generate_answer(
        question: str,
        context: List[Dict]
) -> str:
    """
    Generate an answer using the retrieved context.

    The LLM will be connected here in the next step.
    """

    if not question.strip():
        return "Please enter a question."
    if not context:
        return (
            "I couldn't find relevant information in your "
            "uploaded documents or repository."
        )

    context_text = "\n\n".join(
        item.get("content","")
        for item in context
        if item.get("content")
    )

    return (
        "I found relevant information from your knowledge base.\n\n"
        f"Question: {question}\n\n"
        f"Relevant context:\n{context_text}"
    )