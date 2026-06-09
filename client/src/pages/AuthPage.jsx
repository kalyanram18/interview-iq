import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "", branch: "", graduation_year: 2027 });
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "login") await signIn({ email: form.email, password: form.password });
      else await signUp({ ...form, graduation_year: Number(form.graduation_year) });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed");
    }
  }

  return (
    <div className="min-h-screen bg-mist text-ink dark:bg-ink dark:text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="relative overflow-hidden rounded-lg bg-ink p-8 text-white shadow-glow dark:bg-white/8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(215,255,95,0.24),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(79,209,197,0.24),transparent_26%)]" />
          <div className="relative">
            <div className="grid size-12 place-items-center rounded-lg bg-citron text-ink"><BrainCircuit /></div>
            <h1 className="mt-10 max-w-xl text-5xl font-semibold leading-tight">InterviewIQ</h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">Personalized mock interviews, resume intelligence, AI scoring, and readiness analytics for placement candidates.</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Resume ATS analysis", "Adaptive AI rounds", "Readiness roadmap"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/8 p-4 text-sm text-white/75 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
        <form onSubmit={handleSubmit} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <div className="flex rounded-lg bg-black/5 p-1 dark:bg-white/10">
            <button type="button" className={`seg-btn ${mode === "login" ? "seg-active" : ""}`} onClick={() => setMode("login")}>Login</button>
            <button type="button" className={`seg-btn ${mode === "signup" ? "seg-active" : ""}`} onClick={() => setMode("signup")}>Signup</button>
          </div>
          <div className="mt-6 space-y-4">
            {mode === "signup" && <Input icon={UserRound} label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />}
            <Input icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
            <Input icon={LockKeyhole} label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} required />
            {mode === "signup" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="College" value={form.college} onChange={(value) => setForm({ ...form, college: value })} />
                <Input label="Branch" value={form.branch} onChange={(value) => setForm({ ...form, branch: value })} />
                <Input label="Year" type="number" value={form.graduation_year} onChange={(value) => setForm({ ...form, graduation_year: value })} />
              </div>
            )}
          </div>
          {error && <p className="mt-4 rounded-lg bg-coral/15 px-3 py-2 text-sm text-red-700 dark:text-red-200">{error}</p>}
          <button className="mt-6 w-full rounded-lg bg-ink px-4 py-3 font-medium text-white transition hover:translate-y-[-1px] dark:bg-citron dark:text-ink">
            {mode === "login" ? "Enter dashboard" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ icon: Icon, label, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="text-sm text-black/55 dark:text-white/55">{label}</span>
      <span className="mt-2 flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-3 dark:border-white/10 dark:bg-white/5">
        {Icon && <Icon size={17} className="text-black/40 dark:text-white/40" />}
        <input className="w-full bg-transparent text-sm outline-none" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
      </span>
    </label>
  );
}
