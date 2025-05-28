import type { Alert } from "../types/sensor";

interface AlertTableProps {
  alerts: Alert[];
}

const AlertTable = ({ alerts }: AlertTableProps) => {
  const headers = ["Timestamp", "pH", "Temp", "EC", "Classification"];
  const cellStyle = "border border-gray-300 px-4 py-2";

  if (alerts.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-4">
        No alerts available for this unit.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
      <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className={cellStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, idx) => {
            const isHealthy = alert.classification === "Healthy";
            const rowClass = isHealthy ? "bg-green-300" : "bg-red-300";

            return (
              <tr
                key={idx}
                className={rowClass}
                data-testid={`alert-row-${alert.classification
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                <td className={cellStyle}>
                  {new Date(alert.timestamp).toLocaleString()}
                </td>
                <td className={cellStyle}>{alert.readings.pH}</td>
                <td className={cellStyle}>{alert.readings.temp}</td>
                <td className={cellStyle}>{alert.readings.ec}</td>
                <td className={`${cellStyle} font-medium`}>
                  {alert.classification}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlertTable;
