import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { CheckCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAppStore } from "../store/appStore";

const signUpSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirm"],
});

export function SignUpPage() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    confirm: "",
  });
  
  const [emailChecked, setEmailChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key === "email") setEmailChecked(false);
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const checkEmail = () => {
    const emailResult = z.string().email().safeParse(form.email);
    if (emailResult.success) {
      setEmailChecked(true);
    } else {
      setErrors((prev) => ({ ...prev, email: "유효한 이메일 주소를 입력해주세요." }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailChecked) {
      setErrors((prev) => ({ ...prev, email: "이메일 중복 확인을 해주세요." }));
      return;
    }

    const result = signUpSchema.safeParse(form);
    
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-100 rounded-xl p-8">
          <div className="mb-8 text-center">
            <span className="text-gray-900 font-bold text-2xl tracking-tight">
              Re:Solve
            </span>
            <p className="mt-2 text-gray-500 text-sm">계정 만들기</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">이메일</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@example.com"
                    className="pr-8"
                  />
                  {emailChecked && (
                    <CheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                  )}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={checkEmail}
                  className="whitespace-nowrap"
                >
                  중복 확인
                </Button>
              </div>
              {emailChecked && (
                <p className="mt-1.5 text-green-600 text-xs font-medium">사용 가능한 이메일입니다.</p>
              )}
              {errors.email && <p className="mt-1.5 text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">닉네임</label>
              <Input
                type="text"
                value={form.nickname}
                onChange={(e) => set("nickname", e.target.value)}
                placeholder="resolve_user"
              />
              {errors.nickname && <p className="mt-1.5 text-red-500 text-xs">{errors.nickname}</p>}
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">비밀번호</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-gray-400 text-xs">최소 8자 이상 입력해주세요.</p>
              {errors.password && <p className="mt-1.5 text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-1.5 text-sm">비밀번호 확인</label>
              <Input
                type="password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                placeholder="••••••••"
              />
              {form.confirm && form.password === form.confirm && !errors.confirm && (
                <p className="mt-1.5 text-green-600 flex items-center gap-1.5 text-xs font-medium">
                  <CheckCircle size={14} /> 비밀번호가 일치합니다.
                </p>
              )}
              {errors.confirm && <p className="mt-1.5 text-red-500 text-xs">{errors.confirm}</p>}
            </div>

            <Button type="submit" className="w-full mt-4">
              계정 만들기
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
