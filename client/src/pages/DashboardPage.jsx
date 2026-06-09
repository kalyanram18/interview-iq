import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../components/MetricCard.jsx";
import { getDashboard } from "../services/api.js";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  if (!data) return <div className="skeleton h-96" />;

  const radar = Object.entries(data.topic_scores).map(([topic, score]) => ({ topic, score }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Readiness" value={`${data.readiness_percentage}%`} detail="Weighted by trend and interview depth" tone="citron" />
        <MetricCard label="Average score" value={data.average_score || 67} detail="Across evaluated mock rounds" tone="aqua" />
        <MetricCard label="Mock interviews" value={data.total_interviews} detail="Stored interview sessions" />
        <MetricCard label="Weak topics" value={data.weak_topics.length} detail={data.weak_topics.slice(0, 2).join(", ")} tone="coral" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="panel">
          <h2 className="panel-title">Improvement Trend</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={data.improvement_trend}>
                <defs>
                  <linearGradient id="score" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4fd1c5" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#4fd1c5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#0f766e" fill="url(#score)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <h2 className="panel-title">Topic Radar</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <Radar dataKey="score" stroke="#111827" fill="#d7ff5f" fillOpacity={0.58} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
        <div className="panel">
          <h2 className="panel-title">Skill Performance</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.skill_performance}>
                <XAxis dataKey="skill" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#ff7a66" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <h2 className="panel-title">Recent Interviews</h2>
          <div className="space-y-3">
            {data.recent_interviews.length ? data.recent_interviews.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-black/5 px-4 py-3 dark:bg-white/10">
                <div>
                  <p className="font-medium">{item.role}</p>
                  <p className="text-sm text-black/50 dark:text-white/50">{item.company_mode} · {item.status}</p>
                </div>
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-semibold dark:bg-ink">{item.score || "Pending"}</span>
              </div>
            )) : <p className="text-sm text-black/55 dark:text-white/55">Generate a mock interview to begin tracking performance.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
