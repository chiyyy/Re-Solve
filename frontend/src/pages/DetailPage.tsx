import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Edit2, Trash2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useAppStore } from "../store/appStore";
import { DifficultyBadge } from "../components/Badge";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { Button } from "../components/ui/Button";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { problemApi } from "../api/problem";
import Editor from "@monaco-editor/react";

export function DetailPage() {
  const { id } = useParams();
  const getProblem = useAppStore((state) => state.getProblem);
  const updateProblem = useAppStore((state) => state.updateProblem);
  const deleteProblem = useAppStore((state) => state.deleteProblem);
  const navigate = useNavigate();
  
  const problem = id ? getProblem(id) : undefined;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-4 text-sm">문제를 찾을 수 없습니다.</p>
          <button onClick={() => navigate("/")} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const toggleStatus = async () => {
    if (!problem) return;
    const newStatus = problem.status === "Solved" ? "Review" : "Solved";
    
    // UI 즉각 반영
    updateProblem(problem.id, { status: newStatus });
    
    try {
      const payload = {
        title: problem.title,
        url: problem.url,
        code: problem.code,
        note: problem.note,
        platform: problem.platform.toUpperCase(),
        difficulty: problem.difficulty.toUpperCase(),
        algorithmType: problem.algorithmType,
        status: newStatus.toUpperCase()
      };
      await problemApi.update(problem.id, payload);
    } catch (e) {
      alert("상태 변경에 실패했습니다.");
      // 롤백
      updateProblem(problem.id, { status: problem.status });
    }
  };

  const handleDelete = async () => {
    if (!problem) return;
    try {
      await problemApi.delete(problem.id);
      deleteProblem(problem.id);
      navigate("/");
    } catch (e) {
      alert("삭제에 실패했습니다.");
      setShowDeleteConfirm(false);
    }
  };

  const formattedDate = new Date(problem.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          목록으로
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate(`/problems/${problem.id}/edit`)}>
            <Edit2 size={14} />
            수정
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={14} />
            삭제
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-gray-500 text-sm font-medium bg-gray-50 px-2 py-0.5 rounded">{problem.platform}</span>
                <span className="text-gray-500 text-sm font-medium bg-gray-50 px-2 py-0.5 rounded">{problem.algorithmType}</span>
                <span className="text-gray-400 text-sm ml-2">{formattedDate}</span>
              </div>
              <h1 className="text-gray-900 mb-3 text-2xl font-bold tracking-tight">
                {problem.title}
              </h1>
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                <ExternalLink size={14} />
                원문 문제 보기
              </a>
            </div>

            <div className="shrink-0">
              <p className="text-gray-400 mb-2 text-right text-xs font-medium uppercase tracking-wider">풀이 상태</p>
              <div className="flex border border-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => problem.status !== "Solved" && toggleStatus()}
                  className={`flex items-center gap-2 px-4 py-2.5 transition-colors text-sm font-medium ${
                    problem.status === "Solved"
                      ? "bg-green-50 text-green-700"
                      : "bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <CheckCircle size={16} />
                  풀었음
                </button>
                <button
                  onClick={() => problem.status !== "Review" && toggleStatus()}
                  className={`flex items-center gap-2 px-4 py-2.5 border-l border-gray-100 transition-colors text-sm font-medium ${
                    problem.status === "Review"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-white text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <AlertCircle size={16} />
                  재복습 필요
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-900 shadow-sm">
            <div className="bg-gray-800 px-5 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-gray-400 font-mono text-xs font-semibold tracking-wider">Submitted Code</span>
            </div>
            <div className="flex-1 w-full relative" style={{ minHeight: "400px", maxHeight: "600px" }}>
              <Editor
                height="100%"
                defaultLanguage="java"
                theme="vs-dark"
                value={problem.code || "// 작성된 코드가 없습니다."}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  wordWrap: "on",
                  lineNumbersMinChars: 3,
                  scrollBeyondLastLine: false,
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: "none",
                  hideCursorInOverviewRuler: true
                }}
                loading={<div className="flex items-center justify-center h-full text-gray-500 text-sm">코드 로딩 중...</div>}
              />
            </div>
          </div>

          <div className="flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-white">
            <div className="bg-white px-5 py-3 border-b border-gray-50">
              <span className="text-gray-700 font-semibold text-sm tracking-wide">노트 & 피드백</span>
            </div>
            <div className="p-6 overflow-auto custom-scrollbar" style={{ minHeight: "400px", maxHeight: "600px" }}>
              <MarkdownViewer content={problem.note} />
            </div>
          </div>
        </div>
      </main>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          title={problem.title}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
