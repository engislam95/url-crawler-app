import { CheckCircle, RefreshCw, Loader2, Globe2 } from "lucide-react";

type UrlResult = {
  InternalLinks: number;
  ExternalLinks: number;
  BrokenLinks: number;
  Status: string;
};

const ICONS = {
  "Total URLs": <Globe2 className="w-6 h-6" />,
  Running: <Loader2 className="w-6 h-6 animate-spin" />,
  Completed: <CheckCircle className="w-6 h-6" />,
  Updated: <RefreshCw className="w-6 h-6" />,
};

export const StatsCards = ({ urls }: { urls: UrlResult[] }) => {
  const total = urls.length;
  const running = urls.filter((u) => u.Status === "running").length;
  const done = urls.filter((u) => u.Status === "done").length;
  const updated = urls.filter((u) => u.Status === "updated").length;

  const stats = [
    { label: "Total URLs", value: total, color: "border-blue-500" },
    { label: "Running", value: running, color: "border-yellow-400" },
    { label: "Completed", value: done, color: "border-green-500" },
    { label: "Updated", value: updated, color: "border-pink-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`bg-gray-800/80 backdrop-blur-md border-l-4 ${stat.color} rounded-xl p-5 shadow hover:shadow-xl transition-shadow duration-300 text-gray-100 flex items-center gap-4`}
        >
          <div className="text-blue-200">
            {ICONS[stat.label as keyof typeof ICONS]}
          </div>
          <div>
            <div className="text-sm uppercase tracking-wide text-gray-400">
              {stat.label}
            </div>
            <div className="text-2xl font-extrabold text-white">
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
