import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAppStore } from "../store/appStore";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
});

export function LoginPage() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    
    if (!result.success) {
      const eMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) eMap[issue.path[0].toString()] = issue.message;
      });
      setErrors(eMap);
      return;
    }

    login(form.email);
    navigate("/");
  };

  const handleGitHub = () => {
    login("github_user@example.com");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-100 rounded-xl p-8">
          <div className="mb-8 text-center">
            <span className="text-gray-900 font-bold text-2xl tracking-tight">
              Re:Solve
            </span>
            <p className="mt-2 text-gray-500 text-sm">알고리즘 오답 노트 및 학습 트래커</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">이메일</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">비밀번호</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-red-500 text-xs">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full mt-2">
              로그인
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-gray-400 text-xs font-medium">또는</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <div className="mt-6">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGitHub}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub로 로그인
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-gray-900 hover:text-gray-700 font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
