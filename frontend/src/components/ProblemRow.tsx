import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { PlatformBadge, DifficultyBadge } from "./Badge";
import type { Problem } from "../store/appStore";
import { Button } from "./ui/Button";

interface ProblemRowProps {
  problem: Problem;
  onClick: () => void;
}

export function ProblemRow({ problem, onClick }: ProblemRowProps) {
  return (
    <div
      className="grid grid-cols-[100px_1fr_90px_150px_100px_40px] gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors items-center last:border-0"
      onClick={onClick}
    >
      <PlatformBadge platform={problem.platform} />

      <span className="text-gray-900 font-medium truncate text-sm">
        {problem.title}
      </span>

      <DifficultyBadge difficulty={problem.difficulty} />

      <span className="text-gray-500 truncate text-sm">
        {problem.algorithmType}
      </span>

      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${problem.status === "Solved" ? "text-green-600" : "text-amber-600"}`}>
        {problem.status === "Solved" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
        {problem.status === "Solved" ? "풀었음" : "재복습"}
      </span>

      <Button
        variant="ghostDark"
        size="icon"
        onClick={(e) => { e.stopPropagation(); window.open(problem.url, "_blank"); }}
        title="원문 문제 열기"
      >
        <ExternalLink size={16} />
      </Button>
    </div>
  );
}
