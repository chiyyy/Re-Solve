import { create } from "zustand";
import { persist } from "zustand/middleware";

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
}

interface AppState {
  isLoggedIn: boolean;
  currentUser: string | null;
  problems: Problem[];
  
  login: (email: string) => void;
  logout: () => void;
  
  addProblem: (p: Omit<Problem, "id" | "createdAt">) => string;
  updateProblem: (id: string, p: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  getProblem: (id: string) => Problem | undefined;
}

const SEED_PROBLEMS: Problem[] = [
  {
    id: "1",
    platform: "LeetCode",
    title: "Two Sum",
    difficulty: "Easy",
    algorithmType: "Hash",
    status: "Solved",
    url: "https://leetcode.com/problems/two-sum/",
    code: `def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in seen:
            return [seen[diff], i]
        seen[n] = i`,
    note: `## 풀이 접근법\n\n해시맵을 사용하여 O(n) 시간복잡도로 해결.\n\n- 각 원소를 순회하며 **보완 값(target - n)** 을 해시맵에서 탐색\n- 존재하면 즉시 반환, 없으면 현재 값을 저장\n\n### 핵심 인사이트\n\n투 포인터로도 풀 수 있지만, 정렬이 필요하여 인덱스가 바뀜 → 해시맵이 더 적합`,
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    platform: "BOJ",
    title: "가장 긴 증가하는 부분 수열",
    difficulty: "Medium",
    algorithmType: "DP",
    status: "Review",
    url: "https://www.acmicpc.net/problem/11053",
    code: `import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        int[] dp = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.fill(dp, 1);\n        for (int i = 1; i < n; i++)\n            for (int j = 0; j < i; j++)\n                if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n        System.out.println(Arrays.stream(dp).max().getAsInt());\n    }\n}`,
    note: `## 오답 원인\n\nDP 점화식 실수: \`dp[i] = max(dp[j] + 1)\` 조건에서 **a[j] < a[i]** 비교를 놓쳤음.\n\n### 개선 포인트\n\n- O(n²) DP 풀이는 이해했으나 O(n log n) **이진 탐색 LIS** 도 복습 필요\n- 시간 복잡도 제한 확인 습관 들이기`,
    createdAt: "2026-06-03T14:30:00Z",
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      currentUser: null,
      problems: SEED_PROBLEMS,

      login: (email: string) => set({ isLoggedIn: true, currentUser: email }),
      
      logout: () => set({ isLoggedIn: false, currentUser: null }),

      addProblem: (p) => {
        const id = Date.now().toString();
        const newProblem = { ...p, id, createdAt: new Date().toISOString() };
        set((state) => ({ problems: [...state.problems, newProblem] }));
        return id;
      },

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
