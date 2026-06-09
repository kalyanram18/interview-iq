export default function MetricCard({ label, value, detail, tone = "default" }) {
  const tones = {
    default: "from-white to-white dark:from-white/10 dark:to-white/5",
    citron: "from-citron/70 to-white dark:from-citron/25 dark:to-white/5",
    coral: "from-coral/40 to-white dark:from-coral/25 dark:to-white/5",
    aqua: "from-aqua/45 to-white dark:from-aqua/25 dark:to-white/5",
  };
  return (
    <div className={`rounded-lg border border-black/10 bg-gradient-to-br ${tones[tone]} p-5 shadow-sm dark:border-white/10`}>
      <p className="text-sm text-black/55 dark:text-white/55">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-black/55 dark:text-white/55">{detail}</p>
    </div>
  );
}
