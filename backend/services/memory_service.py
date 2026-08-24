from typing import Dict,List

conversation_memory: Dict[str, List[Dict[str,str]]] = {}

def get_history(
        user_id: str,
        agent_id: str,
) -> List[Dict[str,str]]:
    key = f"{user_id}:{agent_id}"

    return conversation_memory.get(
        key,
        []
    )
def add_message(
        user_id: str,
        agent_id: str,
        role: str,
        content: str,
) -> None:

    key = f"{user_id}:{agent_id}"
    if key not in conversation_memory:
        conversation_memory[key] = []
    conversation_memory[key].append(
        {
            "role": role,
            "content": content,
        }
    )

    conversation_memory[key] = (
        conversation_memory[key][-10:]
    )

def clear_history(
        user_id: str,
        agent_id: str,
) -> None:
    key = f"{user_id}:{agent_id}"

    conversation_memory.pop(
        key,
        None
    )