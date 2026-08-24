import API from "./api";

export type DashboardStats = {
  repositories: number;
  documents: number;
  ai_chats: number;
  analyses: number;
};

export type DashboardUser = {
  name: string;
  agent_id: string;
  role: string;
};

export type DashboardRepository = {
  name: string;
  branch: string;
  visibility: string;
  last_sync: string;
  files_indexed: number;
  indexing_progress: number;
  ai_status: string;
} | null;

export type DashboardActivity = {
  title: string;
  description: string;
  time: string;
};

export type DashboardResponse = {
  user: DashboardUser;
  stats: DashboardStats;
  repository: DashboardRepository;
  recent_activity: DashboardActivity[];
};

export async function getDashboard(): Promise<DashboardResponse> {
  const token = localStorage.getItem("token");

  const response = await API.get("/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}