import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Route } from "lucide-react";
import { generateRoadmap, listRoadmaps } from "../services/api.js";

export default function RoadmapPage() {
  const [role, setRole] = useState("SDE");
  const [roadmaps, setRoadmaps] = useState([]);
  const [busy, setBusy] = useState(false);
  const active = roadmaps[0];

  useEffect(() => {
    listRoadmaps().then(setRoadmaps);
  }, []);

  async function create() {
    setBusy(true);
    try {
      const roadmap = await generateRoadmap({ focus_role: role });
      setRoadmaps([roadmap, ...roadmaps]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="panel-title">AI Roadmap Generator</h2>
          <p className="mt-2 text-sm text-black/55 dark:text-white/55">Creates a preparation plan from dashboard weak areas and selected role.</p>
        </div>
        <div className="flex gap-3">
          <select className="input min-w-40" value={role} onChange={(event) => setRole(event.target.value)}>
            {["SDE", "Full Stack", "AI/ML", "Data Analyst"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <button className="primary-btn" onClick={create} disabled={busy}><Route size={18} /> Generate</button>
        </div>
      </section>
      {active ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <div className="panel">
            <h2 className="panel-title">{active.title}</h2>
            <p className="mt-2 text-sm text-black/55 dark:text-white/55">{active.summary}</p>
            <div className="mt-6 grid gap-3">
              {active.daily_plan.map((day) => (
                <div key={day.day} className="flex gap-3 rounded-lg bg-black/5 p-4 dark:bg-white/10">
                  <CalendarDays className="mt-1 shrink-0" size={18} />
                  <div><p className="font-medium">Day {day.day}: {day.focus}</p><p className="text-sm text-black/55 dark:text-white/55">{day.task}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="panel">
              <h3 className="font-semibold">Priority Topics</h3>
              <div className="mt-4 flex flex-wrap gap-2">{active.priority_topics.map((topic) => <span className="tag tag-warn" key={topic}>{topic}</span>)}</div>
            </div>
            <div className="panel">
              <h3 className="font-semibold">Suggested Practice</h3>
              <div className="mt-4 space-y-3">
                {active.suggested_problems.map((item) => (
                  <div key={item.topic} className="flex items-center gap-3 rounded-lg bg-black/5 p-3 dark:bg-white/10">
                    <CheckCircle2 size={18} /><span className="text-sm">{item.count} {item.difficulty} problems in {item.topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="panel min-h-80"><h2 className="panel-title">No roadmap yet</h2><p className="mt-2 text-sm text-black/55 dark:text-white/55">Generate your first roadmap after taking a mock interview for sharper weak-area targeting.</p></section>
      )}
    </div>
  );
}
