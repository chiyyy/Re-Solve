import CalendarHeatmap from "react-calendar-heatmap";
import { type Problem } from "../store/appStore";

interface Props {
  problems: Problem[];
}

export function HeatmapSection({ problems }: Props) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);

  const getHeatmapData = () => {
    const counts: Record<string, number> = {};
    problems.forEach(p => {
      if (p.createdAt) {
        const dateStr = p.createdAt.split('T')[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  };

  const heatmapData = getHeatmapData();

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 mb-6 shadow-sm">
      <h2 className="text-gray-700 font-semibold text-sm tracking-wide mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        1년 간의 학습 기록
      </h2>
      <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
        <div className="min-w-175">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmapData}
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              if (value.count === 1) return 'color-scale-1';
              if (value.count === 2) return 'color-scale-2';
              if (value.count === 3) return 'color-scale-3';
              return 'color-scale-4';
            }}
            showWeekdayLabels={true}
            titleForValue={(value) => {
              if (!value || value.count === 0) return '문제 없음';
              return `${value.date}: ${value.count}문제 해결`;
            }}
          />
        </div>
      </div>
    </div>
  );
}
