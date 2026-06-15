import { apiClient } from "./client";
import type { Problem, Platform, Difficulty, Status } from "../store/appStore";

const mapPlatform = (p: string): Platform => {
  if (p === "LEETCODE") return "LeetCode";
  if (p === "CODEFORCES") return "Codeforces";
  if (p === "PROGRAMMERS") return "Programmers";
  return "BOJ";
};

const mapDifficulty = (d: string): Difficulty => {
  if (d === "EASY") return "Easy";
  if (d === "MEDIUM") return "Medium";
  return "Hard";
};

const mapStatus = (s: string): Status => {
  if (s === "REVIEW") return "Review";
  return "Solved";
};

export const problemApi = {
  getAll: async (): Promise<Problem[]> => {
    const data = await apiClient("/problems");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((item: any) => ({
      ...item,
      id: String(item.id),
      platform: mapPlatform(item.platform),
      difficulty: mapDifficulty(item.difficulty),
      status: mapStatus(item.status),
    }));
  },
  create: (data: Partial<Problem>): Promise<number> => apiClient("/problems", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  update: (id: string, data: Partial<Problem>): Promise<number> => apiClient(`/problems/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  delete: (id: string): Promise<void> => apiClient(`/problems/${id}`, {
    method: "DELETE"
  }),
};
