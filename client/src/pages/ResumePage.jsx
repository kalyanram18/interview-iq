import { useEffect, useState } from "react";
import { FileUp, Gauge, Tags } from "lucide-react";
import { listResumes, uploadResume } from "../services/api.js";

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const latest = resumes[0];

  useEffect(() => {
    listResumes().then(setResumes);
  }, []);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await uploadResume(file);
      setResumes([result, ...resumes]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <section className="panel">
        <h2 className="panel-title">Resume Analyzer</h2>
        <label className="mt-5 grid cursor-pointer place-items-center rounded-lg border border-dashed border-black/20 bg-black/[0.03] px-6 py-12 text-center transition hover:bg-black/[0.06] dark:border-white/20 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
          <FileUp className="mb-3" />
          <span className="font-medium">{loading ? "Analyzing PDF..." : "Upload PDF resume"}</span>
          <span className="mt-2 text-sm text-black/50 dark:text-white/50">ATS score, extracted skills, missing keywords, and role fit</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={loading} />
        </label>
        <div className="mt-6 space-y-3">
          {resumes.map((resume) => (
            <div key={resume.id} className="rounded-lg bg-black/5 p-4 dark:bg-white/10">
              <p className="font-medium">{resume.file_name}</p>
              <p className="text-sm text-black/50 dark:text-white/50">ATS {resume.ats_score}% · {resume.suitable_roles.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-6">
        {latest ? (
          <>
            <div className="panel">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="panel-title">Latest Analysis</h2>
                  <p className="mt-2 text-sm text-black/55 dark:text-white/55">{latest.summary}</p>
                </div>
                <div className="grid size-28 place-items-center rounded-full border-[10px] border-aqua bg-white text-3xl font-semibold dark:bg-ink">
                  {latest.ats_score}
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <TagPanel icon={Tags} title="Skills" items={latest.skills} />
              <TagPanel icon={Gauge} title="Missing Keywords" items={latest.missing_keywords} tone="warn" />
              <TagPanel title="Dominant Domains" items={latest.dominant_domains} />
              <TagPanel title="Suitable Roles" items={latest.suitable_roles} />
            </div>
          </>
        ) : (
          <div className="panel min-h-80">
            <h2 className="panel-title">No resume analyzed yet</h2>
            <p className="mt-2 text-sm text-black/55 dark:text-white/55">Upload a PDF to populate skill tags, ATS scoring, role prediction, and missing keyword suggestions.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function TagPanel({ title, items = [], tone = "default", icon: Icon }) {
  return (
    <div className="panel">
      <h3 className="flex items-center gap-2 font-semibold">{Icon && <Icon size={18} />}{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <span key={item} className={`tag ${tone === "warn" ? "tag-warn" : ""}`}>{item}</span>) : <span className="text-sm text-black/50 dark:text-white/50">No data yet</span>}
      </div>
    </div>
  );
}
