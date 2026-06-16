import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResponse } from "../api/user";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform = "BOJ" | "LeetCode" | "Programmers" | "Codeforces";
export type AlgorithmType =
  | "Array" | "DP" | "Graph" | "BFS/DFS" | "Greedy"
  | "Two Pointers" | "Sliding Window" | "Binary Search"
  | "Tree" | "Hash" | "Stack/Queue" | "String" | "Math" | "Other";
export type Status = "Solved" | "Review";

export interface Problem {
  id: string;
  platform: Platform;
  title: string;
  difficulty: Difficulty;
  algorithmType: AlgorithmType;
  status: Status;
  url: string;
  code: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  
  // 에빙하우스 복습 필드
  reviewStep: number;
  nextReviewDate: string | null;
  isTodayReview: boolean;
}

interface AppState {
  isLoggedIn: boolean;
  currentUser: UserResponse | null;
  problems: Problem[];
  
  login: (user: UserResponse) => void;
  logout: () => void;
  
  setProblems: (problems: Problem[]) => void;

  updateProblem: (id: string, p: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  getProblem: (id: string) => Problem | undefined;
}



export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      currentUser: null,
      problems: [],

      login: (user: UserResponse) => set({ isLoggedIn: true, currentUser: user }),
      
      logout: () => set({ isLoggedIn: false, currentUser: null }),

      setProblems: (problems) => set({ problems }),



      updateProblem: (id, updatedFields) => {
        set((state) => ({
          problems: state.problems.map((prob) =>
            prob.id === id ? { ...prob, ...updatedFields } : prob
          ),
        }));
      },

      deleteProblem: (id) => {
        set((state) => ({
          problems: state.problems.filter((prob) => prob.id !== id),
        }));
      },

      getProblem: (id) => {
        return get().problems.find((prob) => prob.id === id);
      },
    }),
    {
      name: "resolve_storage", // key in localStorage
    }
  )
);
