import API from "./api";

export interface ChatSource {
  filename?: string;
  document_id?: string;
  chunk_index?: number;
  score?: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
}

export interface ClearChatResponse {
  message: string;
  deleted_count?: number;
}

// SEND MESSAGE
export async function sendChatMessage(
  question: string,
  agentId: string,
  documentId: string
): Promise<ChatResponse> {
  if (!question.trim()) {
    throw new Error("Question cannot be empty.");
  }

  if (!agentId) {
    throw new Error("Please select an agent first.");
  }

  if (!documentId) {
    throw new Error("Please select a document first.");
  }

  try {
    const response = await API.post<ChatResponse>(
      "/chat",
      {
        question: question.trim(),
        agent_id: agentId,
        document_id: documentId,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "CHAT REQUEST ERROR:",
      error.response?.data || error
    );

    const detail =
      error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    throw new Error(
      "Failed to get an AI response."
    );
  }
}

// GET HISTORY
export async function getChatHistory(
  agentId: string,
  documentId: string
): Promise<ChatHistoryResponse> {
  if (!agentId) {
    throw new Error(
      "Agent ID is required."
    );
  }

  if (!documentId) {
    return {
      messages: [],
    };
  }

  try {
    const response =
      await API.get<ChatHistoryResponse>(
        `/chat/history/${encodeURIComponent(
          agentId
        )}`,
        {
          params: {
            document_id:
              documentId,
          },
        }
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "CHAT HISTORY ERROR:",
      error.response?.data || error
    );

    const detail =
      error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    throw new Error(
      "Failed to load chat history."
    );
  }
}

// CLEAR HISTORY
export async function clearChatHistory(
  agentId: string,
  documentId: string
): Promise<ClearChatResponse> {
  if (!agentId) {
    throw new Error(
      "Agent ID is required."
    );
  }

  if (!documentId) {
    throw new Error(
      "Document ID is required."
    );
  }

  try {
    const response =
      await API.delete<ClearChatResponse>(
        `/chat/history/${encodeURIComponent(
          agentId
        )}`,
        {
          params: {
            document_id:
              documentId,
          },
        }
      );

    return response.data;
  } catch (error: any) {
    console.error(
      "CLEAR CHAT ERROR:",
      error.response?.data || error
    );

    const detail =
      error.response?.data?.detail;

    if (typeof detail === "string") {
      throw new Error(detail);
    }

    throw new Error(
      "Failed to clear chat history."
    );
  }
}