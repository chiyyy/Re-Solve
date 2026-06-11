import type { Difficulty, Platform } from "../store/appStore";

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "text-green-700 bg-green-50",
  Medium: "text-amber-700 bg-amber-50",
  Hard: "text-red-700 bg-red-50",
};

const PLATFORM_COLORS: Record<Platform, string> = {
  BOJ: "text-blue-700 bg-blue-50",
  LeetCode: "text-orange-700 bg-orange-50",
  Programmers: "text-purple-700 bg-purple-50",
  Codeforces: "text-sky-700 bg-sky-50",
};

export function DifficultyBadge({ difficulty, className = "" }: { difficulty: Difficulty; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold w-fit ${DIFFICULTY_COLORS[difficulty]} ${className}`}>
      {difficulty}
    </span>
  );
}

export function PlatformBadge({ platform, className = "" }: { platform: Platform; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold w-fit ${PLATFORM_COLORS[platform]} ${className}`}>
      {platform}
    </span>
  );
}
