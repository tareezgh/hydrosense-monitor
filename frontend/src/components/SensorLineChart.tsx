// My Enhancement
import type { Alert } from "../types/sensor";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  TooltipItem,
  Legend,
  ChartTypeRegistry,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

interface SensorLineChartProps {
  alerts: Alert[];
}

const SENSOR_METRICS = [
  { key: "pH", label: "pH", color: "#3b82f6" },
  { key: "temp", label: "Temp (°C)", color: "#22c55e" },
  { key: "ec", label: "EC", color: "#f97316" },
] as const;

const SensorLineChart = ({ alerts }: SensorLineChartProps) => {
  const labels = alerts.map((a) =>
    new Date(a.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const datasets = SENSOR_METRICS.map(({ key, label, color }) => ({
    label,
    data: alerts.map((a) => a.readings[key]),
    borderColor: color,
    backgroundColor: `${color}`,
    tension: 0.3,
    pointRadius: alerts.map((a) =>
      key === "pH" && (a.readings.pH < 5.5 || a.readings.pH > 7) ? 6 : 3
    ),
    pointBackgroundColor: alerts.map((a) =>
      key === "pH" && (a.readings.pH < 5.5 || a.readings.pH > 7)
        ? "#ef4444"
        : color
    ),
  }));

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) => {
            const index = tooltipItems[0].dataIndex;
            return `${labels[index]} – ${alerts[index].classification}`;
          },
          afterBody: (tooltipItems: TooltipItem<keyof ChartTypeRegistry>[]) => {
            const index = tooltipItems[0].dataIndex;
            const reading = alerts[index].readings;
            return `pH: ${reading.pH} | Temp: ${reading.temp}°C | EC: ${reading.ec}`;
          },
        },
      },
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const summary = (() => {
    const needsAttentionCount = alerts.filter(
      (a) => a.classification === "Needs Attention"
    ).length;
    if (needsAttentionCount > 0) {
      return `⚠️ ${needsAttentionCount} alert(s) in last readings.`;
    }
    return "All readings look good.";
  })();

  return (
    <div className="space-y-4">
      <Line data={data} options={options} />

      {/* Health Timeline */}
      <div className="text-sm text-center font-medium">Health Timeline</div>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {alerts.map((alert, idx) => {
          const { pH, temp, ec } = alert.readings;
          const classification = alert.classification;
          const time = labels[idx];
          const color =
            classification === "Needs Attention"
              ? "bg-red-500"
              : "bg-green-500";

          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded ${color} relative group cursor-pointer`}
              data-testid={`timeline-dot-${
                classification === "Needs Attention" ? "red" : "green"
              }`}
            >
              {/* Tooltip */}
              <div className="absolute z-10 hidden group-hover:flex flex-col text-xs text-white bg-black bg-opacity-80 px-2 py-1 rounded bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className="font-semibold">{time}</div>
                <div>pH: {pH}</div>
                <div>Temp: {temp}°C</div>
                <div>EC: {ec}</div>
                <div className="mt-1 font-medium">{classification}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Tip */}
      <div className="bg-gray-100 text-sm text-gray-800 px-4 py-2 rounded shadow">
        {summary}
      </div>
    </div>
  );
};

export default SensorLineChart;
