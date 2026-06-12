import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useAppStore, type Difficulty, type Platform, type AlgorithmType, type Status } from "../store/appStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { problemApi } from "../api/problem";

const PLATFORMS: Platform[] = ["BOJ", "LeetCode", "Programmers", "Codeforces"];
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const ALGORITHMS: AlgorithmType[] = [
  "Array", "DP", "Graph", "BFS/DFS", "Greedy",
  "Two Pointers", "Sliding Window", "Binary Search",
  "Tree", "Hash", "Stack/Queue", "String", "Math", "Other",
];
const STATUSES: Status[] = ["Solved", "Review"];

export function EditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const addProblem = useAppStore((state) => state.addProblem);
  const updateProblem = useAppStore((state) => state.updateProblem);
  const getProblem = useAppStore((state) => state.getProblem);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    platform: "LeetCode" as Platform,
    title: "",
    difficulty: "Easy" as Difficulty,
    algorithmType: "Array" as AlgorithmType,
    status: "Solved" as Status,
    url: "",
    code: "",
    note: "",
  });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const p = getProblem(id);
      if (p) {
        setForm({
          platform: p.platform,
          title: p.title,
          difficulty: p.difficulty,
          algorithmType: p.algorithmType,
          status: p.status,
          url: p.url,
          code: p.code,
          note: p.note,
        });
      }
    }
  }, [id, isEdit, getProblem]);

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.title.trim() || isSaving) return;
    setIsSaving(true);
    
    try {
      const payload = {
        ...form,
        platform: form.platform.toUpperCase(),
        difficulty: form.difficulty.toUpperCase(),
        status: form.status.toUpperCase()
      };
      
      if (isEdit && id) {
        await problemApi.update(id, payload);
        updateProblem(id, form); // 로컬 스토어 즉각 갱신
        setSaved(true);
        setTimeout(() => navigate(`/problems/${id}`), 600);
      } else {
        await problemApi.create(payload);
        setSaved(true);
        setTimeout(() => navigate("/"), 600);
      }
    } catch (err) {
      console.error(err);
      alert("문제 저장 및 깃허브 푸시에 실패했습니다.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            뒤로
          </Button>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-gray-900 font-semibold text-lg">
            {isEdit ? "문제 수정" : "새 문제 등록"}
          </span>
        </div>
        <Button
          onClick={handleSave}
          disabled={!form.title.trim() || isSaving}
          variant={saved ? "success" : "primary"}
        >
          <Save size={16} />
          {isSaving ? "저장 중..." : saved ? "저장됨" : "저장"}
        </Button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">문제 URL</label>
              <Input
                type="url"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder="https://leetcode.com/problems/..."
              />
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">문제 제목 <span className="text-gray-300">*</span></label>
              <Input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Two Sum"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">플랫폼</label>
              <Select value={form.platform} onChange={(e) => set("platform", e.target.value)}>
                {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">난이도</label>
              <Select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">알고리즘 유형</label>
              <Select value={form.algorithmType} onChange={(e) => set("algorithmType", e.target.value)}>
                {ALGORITHMS.map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">풀이 상태</label>
              <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s === "Solved" ? "풀었음" : "재복습 필요"}</option>)}
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-900">
            <div className="bg-gray-800 px-5 py-3 flex items-center gap-3 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-600" />
                <div className="w-3 h-3 rounded-full bg-gray-600" />
                <div className="w-3 h-3 rounded-full bg-gray-600" />
              </div>
              <span className="text-gray-400 font-mono text-xs">내 코드 작성</span>
            </div>
            <textarea
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="# 여기에 코드를 붙여넣으세요..."
              className="flex-1 bg-gray-900 text-gray-300 p-5 resize-none outline-none font-mono placeholder-gray-600 w-full text-sm leading-relaxed custom-scrollbar"
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const val = form.code;
                  set("code", val.substring(0, start) + "    " + val.substring(end));
                  setTimeout(() => {
                    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                  }, 0);
                }
              }}
            />
          </div>

          <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-white">
            <div className="bg-white px-5 py-3 border-b border-gray-50">
              <span className="text-gray-700 font-semibold text-sm tracking-wide">노트 & 피드백 (Markdown)</span>
            </div>
            <textarea
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="## 오답 원인&#10;&#10;접근 방식에 문제가 있었습니다...&#10;&#10;### 개선점&#10;- 시간 복잡도 고려하기"
              className="flex-1 bg-white text-gray-800 p-5 resize-none outline-none font-sans placeholder-gray-300 w-full text-sm leading-relaxed custom-scrollbar"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
