import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import { useAppStore } from "./store/appStore";

import { DashboardPage } from "./pages/DashboardPage";
import { DetailPage } from "./pages/DetailPage";
import { EditorPage } from "./pages/EditorPage";
import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";

function Root() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AuthRoot() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  if (isLoggedIn) return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoot />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        
        <Route element={<Root />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/problems/new" element={<EditorPage />} />
          <Route path="/problems/:id" element={<DetailPage />} />
          <Route path="/problems/:id/edit" element={<EditorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
