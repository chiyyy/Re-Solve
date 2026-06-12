import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { DashboardPage } from "./pages/DashboardPage";
import { DetailPage } from "./pages/DetailPage";
import { EditorPage } from "./pages/EditorPage";
import { LoginPage } from "./pages/LoginPage";
import { useAppStore } from "./store/appStore";

function App() {
  const currentUser = useAppStore((state) => state.currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={currentUser ? <DashboardPage /> : <Navigate to="/login" replace />} />
        <Route path="/problems/new" element={currentUser ? <EditorPage /> : <Navigate to="/login" replace />} />
        <Route path="/problems/:id" element={currentUser ? <DetailPage /> : <Navigate to="/login" replace />} />
        <Route path="/problems/:id/edit" element={currentUser ? <EditorPage /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
