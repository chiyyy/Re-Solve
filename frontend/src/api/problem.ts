import { apiClient } from "./client";
import type { Problem } from "../store/appStore";

export const problemApi = {
  // 나중에 백엔드와 연결할 때 사용할 뼈대들
  getAll: (): Promise<Problem[]> => apiClient("/problems"),
  // getById: (id: string) => apiClient(`/problems/${id}`),
  // create: (data: any) => apiClient("/problems", { method: "POST", body: JSON.stringify(data) }),
  // update: (id: string, data: any) => apiClient(`/problems/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  // delete: (id: string) => apiClient(`/problems/${id}`, { method: "DELETE" }),
};
