import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, LogOut } from "lucide-react";
import { useAppStore, type Difficulty, type AlgorithmType, type Status } from "../store/appStore";
import { StatCard } from "../components/StatCard";
import { ProblemRow } from "../components/ProblemRow";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

const ALL_DIFFICULTIES: Array<Difficulty | "All"> = ["All", "Easy", "Medium", "Hard"];
const ALL_ALGORITHMS: Array<AlgorithmType | "All"> = [
  "All", "Array", "DP", "Graph", "BFS/DFS", "Greedy",
  "Two Pointers", "Sliding Window", "Binary Search", "Tree", "Hash",
  "Stack/Queue", "String", "Math", "Other",
];


export function DashboardPage() {
  const problems = useAppStore((state) => state.problems);
  const logout = useAppStore((state) => state.logout);
  const currentUser = useAppStore((state) => state.currentUser);
  
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [algorithm, setAlgorithm] = useState<AlgorithmType | "All">("All");
  const [status, setStatus] = useState<Status | "All">("All");

  const filtered = problems.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.platform.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === "All" || p.difficulty === difficulty;
    const matchAlgo = algorithm === "All" || p.algorithmType === algorithm;
    const matchStatus = status === "All" || p.status === status;
    return matchSearch && matchDiff && matchAlgo && matchStatus;
  });

  const solvedCount = problems.filter((p) => p.status === "Solved").length;
  const reviewCount = problems.filter((p) => p.status === "Review").length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <span className="text-gray-900 font-semibold text-lg tracking-tight">
          Re:Solve
        </span>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">{currentUser?.nickname}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
            로그아웃
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="전체 문제" value={problems.length} />
          <StatCard label="풀었음" value={solvedCount} labelClassName="text-green-600" />
          <StatCard label="재복습 필요" value={reviewCount} labelClassName="text-amber-600" />
        </div>

        <div className="bg-white border border-gray-100 rounded-lg mb-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap gap-3 items-center bg-white">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="문제 번호나 제목을 검색하세요..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty | "All")}
              className="w-32"
            >
              {ALL_DIFFICULTIES.map((d) => <option key={d} value={d}>{d === "All" ? "모든 난이도" : d}</option>)}
            </Select>

            <Select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as AlgorithmType | "All")}
              className="w-36"
            >
              {ALL_ALGORITHMS.map((a) => <option key={a} value={a}>{a === "All" ? "모든 유형" : a}</option>)}
            </Select>

            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status | "All")}
              className="w-32"
            >
              <option value="All">모든 상태</option>
              <option value="Solved">풀었음</option>
              <option value="Review">재복습 필요</option>
            </Select>

            <Button className="ml-auto" onClick={() => navigate("/problems/new")}>
              <Plus size={16} />
              문제 추가
            </Button>
          </div>

          <div className="grid grid-cols-[100px_1fr_90px_150px_100px_40px] gap-4 px-5 py-3 border-b border-gray-50 bg-white">
            {["플랫폼", "문제 제목", "난이도", "알고리즘", "상태", ""].map((h, i) => (
              <span key={i} className="text-gray-400 font-medium text-xs tracking-wider uppercase">{h}</span>
            ))}
          </div>
          <div className="flex flex-col">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-sm">
                조건에 맞는 문제가 없습니다.
              </div>
            ) : (
              filtered.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} onClick={() => navigate(`/problems/${problem.id}`)} />
              ))
            )}
          </div>
        </div>

        <p className="mt-3 text-gray-400 text-right text-xs font-medium">
          {filtered.length}개 / 전체 {problems.length}개
        </p>
      </main>
    </div>
  );
}
