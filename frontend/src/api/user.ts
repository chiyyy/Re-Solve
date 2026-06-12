import { apiClient } from "./client";

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  githubRepoName: string | null;
}

export const userApi = {
  // 내 정보 가져오기 API
  getMe: (): Promise<UserResponse> => apiClient("/users/me"),
};
