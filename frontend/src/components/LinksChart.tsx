import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip as BarTooltip,
} from "recharts";

type UrlResult = {
  InternalLinks: number;
  ExternalLinks: number;
  BrokenLinks: number;
  Status: string;
};

const COLORS = ["#60A5FA", "#93C5FD"]; // Harmonized cool blues

export const LinksChart = ({ urls }: { urls: UrlResult[] }) => {
  const totalInternal = urls.reduce((sum, u) => sum + u.InternalLinks, 0);
  const totalExternal = urls.reduce((sum, u) => sum + u.ExternalLinks, 0);

  const data = [
    { name: "Internal Links", value: totalInternal },
    { name: "External Links", value: totalExternal },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-700 to-gray-800  rounded-2xl shadow-inner p-6 text-gray-100 w-full">
      <h2 className="text-xl font-bold mb-6">Link Distribution Overview</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Pie Chart */}
        <div className="flex-1">
          <h4 className="text-md font-semibold text-gray-300 mb-3">
            Pie Representation
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({
                  name,
                  percent,
                }: {
                  name: string;
                  percent?: number;
                }) => `${name}: ${percent ? (percent * 100).toFixed(0) : "0"}%`}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <PieTooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F3F4F6",
                }}
                labelStyle={{
                  color: "#F3F4F6",
                }}
                itemStyle={{
                  color: "#F3F4F6",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="flex-1">
          <h4 className="text-md font-semibold text-gray-300 mb-3">
            Bar Representation
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <BarTooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                  color: "#F3F4F6",
                }}
              />
              <Legend wrapperStyle={{ color: "#E5E7EB" }} />
              <Bar
                dataKey="value"
                barSize={30}
                radius={[6, 6, 0, 0]}
                fill={COLORS[0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
