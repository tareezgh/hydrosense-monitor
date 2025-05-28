import type { FullAlert } from "../types/sensor";

interface RandomReadingPopupProps {
  alert: FullAlert | null;
  onClose: () => void;
}

const RandomReadingPopup = ({ alert, onClose }: RandomReadingPopupProps) => {
  if (!alert) return null;

  const isHealthy = alert.classification === "Healthy";
  const style = isHealthy ? "text-green-600" : "text-red-600";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] space-y-4 relative">
        <button
          onClick={onClose}
          className="text-2xl absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold">New Random Reading</h2>
        <p>
          <strong>Unit ID:</strong> {alert.unitId}
        </p>
        <p>
          <strong>Classification:</strong>{" "}
          <span className={style}>{alert.classification}</span>
        </p>
        <p className="text-sm text-gray-600">
          <strong>pH:</strong> {alert.readings.pH} | <strong>Temp:</strong>{" "}
          {alert.readings.temp}°C | <strong>EC:</strong> {alert.readings.ec}
        </p>
      </div>
    </div>
  );
};

export default RandomReadingPopup;
