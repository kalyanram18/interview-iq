import { useEffect, useMemo, useState } from "react";
import { Clock, Send, WandSparkles } from "lucide-react";
import { generateInterview, listResumes, submitAnswer } from "../services/api.js";

export default function InterviewPage() {
  const [resumes, setResumes] = useState([]);
  const [config, setConfig] = useState({ role: "SDE", difficulty: "medium", company_mode: "Amazon", question_count: 6, resume_id: "" });
  const [interview, setInterview] = useState(null);
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const question = interview?.questions?.[active];
  const progress = useMemo(() => interview ? Math.round(((active + 1) / interview.questions.length) * 100) : 0, [interview, active]);

  useEffect(() => {
    listResumes().then(setResumes);
  }, []);

  async function startInterview() {
    setBusy(true);
    setFeedback(null);
    try {
      const data = await generateInterview({ ...config, resume_id: config.resume_id ? Number(config.resume_id) : null, question_count: Number(config.question_count) });
      setInterview(data);
      setActive(0);
      setAnswer("");
    } finally {
      setBusy(false);
    }
  }

  async function sendAnswer() {
    if (!answer.trim()) return;
    setBusy(true);
    try {
      const result = await submitAnswer(interview.id, question.id, answer);
      setFeedback(result.evaluation);
      setAnswer("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <section className="panel">
        <h2 className="panel-title">Interview Setup</h2>
        <div className="mt-5 grid gap-4">
          <Select label="Role" value={config.role} onChange={(value) => setConfig({ ...config, role: value })} options={["SDE", "Full Stack", "AI/ML", "Data Analyst"]} />
          <Select label="Difficulty" value={config.difficulty} onChange={(value) => setConfig({ ...config, difficulty: value })} options={["easy", "medium", "hard"]} />
          <Select label="Company Mode" value={config.company_mode} onChange={(value) => setConfig({ ...config, company_mode: value })} options={["Generic", "Google", "Amazon", "Microsoft", "TCS", "Infosys"]} />
          <Select label="Resume Context" value={config.resume_id} onChange={(value) => setConfig({ ...config, resume_id: value })} options={["", ...resumes.map((resume) => String(resume.id))]} labels={{ "": "No resume", ...Object.fromEntries(resumes.map((resume) => [resume.id, resume.file_name])) }} />
          <label className="text-sm">
            <span className="text-black/55 dark:text-white/55">Questions</span>
            <input className="input mt-2" type="number" min="3" max="15" value={config.question_count} onChange={(event) => setConfig({ ...config, question_count: event.target.value })} />
          </label>
        </div>
        <button className="primary-btn mt-6 w-full" onClick={startInterview} disabled={busy}>
          <WandSparkles size={18} /> Generate interview
        </button>
      </section>
      <section className="panel min-h-[620px]">
        {question ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-black/50 dark:text-white/50">{question.category} · Question {active + 1} of {interview.questions.length}</p>
                <h2 className="mt-2 text-2xl font-semibold">{question.prompt}</h2>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 text-sm dark:bg-white/10">
                <Clock size={16} /> {progress}%
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-black/10 dark:bg-white/10"><div className="h-full rounded-full bg-aqua" style={{ width: `${progress}%` }} /></div>
            <div className="mt-5 flex flex-wrap gap-2">{question.expected_signals.map((signal) => <span key={signal} className="tag">{signal}</span>)}</div>
            <textarea className="mt-6 min-h-56 flex-1 resize-none rounded-lg border border-black/10 bg-white p-4 outline-none dark:border-white/10 dark:bg-white/5" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your answer as if you are in the interview..." />
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="primary-btn" onClick={sendAnswer} disabled={busy}><Send size={18} /> Evaluate answer</button>
              <button className="secondary-btn" onClick={() => { setActive(Math.min(active + 1, interview.questions.length - 1)); setFeedback(null); }}>Next question</button>
            </div>
            {feedback && <Feedback feedback={feedback} />}
          </div>
        ) : (
          <div className="grid h-full place-items-center text-center">
            <div>
              <h2 className="text-3xl font-semibold">Generate a personalized round</h2>
              <p className="mx-auto mt-3 max-w-md text-black/55 dark:text-white/55">Questions adapt to role, difficulty, company mode, and resume skills.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Select({ label, value, onChange, options, labels = {} }) {
  return (
    <label className="text-sm">
      <span className="text-black/55 dark:text-white/55">{label}</span>
      <select className="input mt-2" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{labels[option] || option}</option>)}
      </select>
    </label>
  );
}

function Feedback({ feedback }) {
  return (
    <div className="mt-5 rounded-lg border border-black/10 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between"><h3 className="font-semibold">AI Evaluation</h3><span className="text-2xl font-semibold">{feedback.score}/100</span></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {["technical_accuracy", "communication", "depth"].map((key) => <div key={key} className="rounded-lg bg-white p-3 text-sm dark:bg-ink">{key.replace("_", " ")}<p className="text-xl font-semibold">{feedback[key]}</p></div>)}
      </div>
      <p className="mt-4 text-sm text-black/60 dark:text-white/60">{feedback.improvements[0]}</p>
    </div>
  );
}
