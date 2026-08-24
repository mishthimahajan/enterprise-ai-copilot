export interface LoginRequest {
  agent_id: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  agent_id: string;
  password: string;
  confirm_password: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  agent_id: string;
  role: string;
}

export interface LoginFormData {
  agentId: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  agentId: string;
  password: string;
  confirmPassword: string;
  role: string;
}