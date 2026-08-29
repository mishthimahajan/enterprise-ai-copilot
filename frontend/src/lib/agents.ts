import api from "./axios";




export interface Agent {
  agent_id: string;

  name: string;

  description?: string;

  owner_id?: string | null;

  members?: string[];

  created_by?: string | null;

  created_by_name?: string | null;

  is_active?: boolean;

  created_at?: string | null;

  updated_at?: string | null;
}


export interface CreateAgentData {
  name: string;
  description?: string;
}




export async function getAgents(): Promise<Agent[]> {

  try {

    const response =
      await api.get<Agent[]>(
        "/agents/"
      );

    return response.data;

  } catch (error: any) {

    console.error(
      "GET AGENTS ERROR:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.detail ||
      "Failed to load agents."
    );

  }

}



export async function createAgent(
  data: CreateAgentData
): Promise<Agent> {

  try {

    const response =
      await api.post<Agent>(
        "/agents/",
        data
      );

    return response.data;

  } catch (error: any) {

    console.error(
      "CREATE AGENT ERROR:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.detail ||
      "Failed to create agent."
    );

  }

}




export function setSelectedAgent(
  agentId: string
): void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    "selected_agent_id",
    agentId
  );

}



export function getSelectedAgent():
  string | null {

  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "selected_agent_id"
  );

}




export function clearSelectedAgent():
  void {

  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    "selected_agent_id"
  );

}