import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAppStore } from "../store/appStore";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. 주소창에서 token 낚아채기
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // 2. 낚아챈 토큰을 브라우저 창고(localStorage)에 안전하게 보관
      localStorage.setItem("resolve_token", token);
      
      // 3. 백엔드에 내 깃허브 닉네임 물어보기!
      fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("유저 정보를 불러올 수 없습니다.");
          return res.json();
        })
        .then(data => {
          // 4. 백엔드가 응답한 진짜 깃허브 닉네임을 상태에 저장!
          login(data.nickname); 
          
          // 5. 대시보드로 이동하며 주소창 청소
          navigate("/", { replace: true });
        })
        .catch(err => {
          console.error("로그인 에러:", err);
          alert("로그인 중 문제가 발생했습니다.");
        });
    }
  }, [searchParams, navigate, login]);

  const handleGitHub = () => {
    // 백엔드의 OAuth2 로그인 주소로 진짜 리다이렉트 시킴!
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center space-y-8 shadow-sm">
          <div>
            <h1 className="text-gray-900 font-bold text-3xl tracking-tight">Re:Solve</h1>
            <p className="mt-2 text-gray-500 text-sm">GitHub 연동 알고리즘 오답 노트</p>
          </div>

          <Button
            size="lg"
            className="w-full text-base font-semibold bg-gray-900 text-white hover:bg-gray-800 py-3"
            onClick={handleGitHub}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub로 시작하기
          </Button>

          <p className="text-gray-400 text-xs leading-relaxed">
            문제를 풀면 연동된 GitHub 레포지토리에<br />
            자동으로 풀이와 노트가 커밋됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
