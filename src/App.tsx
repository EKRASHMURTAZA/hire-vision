import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Setup from "./pages/Setup";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import History from "./pages/History";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import ResumeBuilder from "./pages/ResumeBuilder";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary";

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.userRole !== "admin") return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
}

function DashboardRedirect() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("hirevision_user");
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setRole(u.userRole || "user");
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  
  return role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
            
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/redirect" element={<DashboardRedirect />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: "#0f172a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "1rem",
                padding: "1rem 1.5rem",
                fontWeight: "bold",
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
