import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import AppShell from "./components/AppShell.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ResumePage from "./pages/ResumePage.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center bg-mist text-ink dark:bg-ink dark:text-white">Loading InterviewIQ</div>;
  if (!user) return <Navigate to="/auth" replace state={{ from: location }} />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <AppShell />
            </Protected>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
