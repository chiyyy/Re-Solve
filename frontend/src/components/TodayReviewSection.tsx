import { useNavigate } from "react-router";
import { type Problem } from "../store/appStore";
import { problemApi } from "../api/problem";
import { Button } from "./ui/Button";

interface Props {
  problems: Problem[];
  onReviewComplete: () => void;
}

export function TodayReviewSection({ problems, onReviewComplete }: Props) {
  const navigate = useNavigate();
  const todayReviews = problems.filter((p) => p.isTodayReview);

  if (todayReviews.length === 0) return null;

  const handleCompleteReview = async (problemId: string) => {
    try {
      await problemApi.completeReview(problemId);
      onReviewComplete();
    } catch (err) {
      console.error(err);
      alert("실패했습니다.");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-gray-800 font-semibold text-base tracking-wide mb-3 flex items-center gap-2">
        <span>오늘의 복습</span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
          {todayReviews.length}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {todayReviews.map((problem) => (
          <div 
            key={problem.id} 
            className="group bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm cursor-pointer hover:border-gray-300 hover:shadow transition-all"
            onClick={() => navigate(`/problems/${problem.id}`)}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {problem.reviewStep === 0 ? "1일차" : problem.reviewStep === 1 ? "3일차" : "7일차"} 복습
                </span>
                <span className="text-gray-400 text-xs font-medium">{problem.platform}</span>
              </div>
              <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {problem.title}
              </h3>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteReview(problem.id);
                }}
              >
                복습 완료
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
