import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, FileText, LogOut, Map, Moon, Sparkles, Sun, TerminalSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/interview", label: "Interview", icon: TerminalSquare },
  { to: "/roadmap", label: "Roadmap", icon: Map },
];

export default function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.theme === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <div className="min-h-screen bg-mist text-ink dark:bg-ink dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-black/10 bg-white/80 px-5 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-ink text-citron dark:bg-citron dark:text-ink">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-lg font-semibold">InterviewIQ</p>
            <p className="text-xs text-black/50 dark:text-white/50">AI placement command center</p>
          </div>
        </div>
        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  isActive ? "bg-ink text-white shadow-glow dark:bg-white dark:text-ink" : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-black/10 bg-mist/85 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-ink/80 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-black/50 dark:text-white/50">Welcome back</p>
              <h1 className="text-xl font-semibold">{user?.name || "Candidate"}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="icon-btn" onClick={() => setDark((value) => !value)} title="Toggle theme">
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                className="icon-btn"
                onClick={() => {
                  signOut();
                  navigate("/auth");
                }}
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
          <nav className="mt-4 grid grid-cols-4 gap-2 lg:hidden">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `mobile-tab ${isActive ? "mobile-tab-active" : ""}`}>
                <item.icon size={17} />
              </NavLink>
            ))}
          </nav>
        </header>
        <div className="px-4 py-6 sm:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
