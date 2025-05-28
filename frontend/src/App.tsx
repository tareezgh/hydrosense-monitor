import { useEffect, useState } from "react";
import { useAlerts } from "./hooks/useAlerts";
import { generateRandomReading } from "./utils/randomReading";
import { postSensorReading } from "./api/sensorApi";
import AlertTable from "./components/AlertTable";
import SensorLineChart from "./components/SensorLineChart";
import type { FullAlert } from "./types/sensor";
import { isValidUnitId } from "./utils/validUnit";
import "./App.css";
import RandomReadingPopup from "./components/RandomReadingPopup";

function App() {
  const [activeUnitId, setActiveUnitId] = useState("");
  const [searchUnitId, setSearchUnitId] = useState("");
  const [lastReading, setLastReading] = useState<FullAlert | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const { alerts, setAlerts, loading, error, fetchAlerts } = useAlerts();

  const handleSearch = () => {
    const unitId = searchUnitId.trim();
    if (!isValidUnitId(unitId)) {
      alert("Invalid unit ID format. Use: unit-123");
      return;
    }
    setActiveUnitId(unitId);
    fetchAlerts(unitId);
  };

  const sendRandomReading = async () => {
    // If input is empty, generate a random unit ID
    const trimmedInput = searchUnitId.trim();
    const isUserSearched = trimmedInput !== "";
    const unitIdToUse = isUserSearched ? trimmedInput : undefined;

    if (unitIdToUse && !isValidUnitId(unitIdToUse)) {
      alert("Invalid unit ID format. Use: unit-123");
      return;
    }

    const reading = generateRandomReading(unitIdToUse);

    try {
      const result = await postSensorReading(reading);
      const fullReading = {
        ...reading,
        timestamp: new Date(reading.timestamp),
        classification: result.classification,
      };
      setLastReading(fullReading);
      setActiveUnitId(unitIdToUse);
      setShowPopup(true);
      const alertToAdd = {
        timestamp: fullReading.timestamp,
        readings: fullReading.readings,
        classification: fullReading.classification,
      };

      if (isUserSearched)
        setAlerts((prev) => [alertToAdd, ...prev.slice(0, 20)]);
    } catch (err) {
      console.error("Failed to send reading:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(sendRandomReading, 600_000); // every 10 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAlerts([]);
    setActiveUnitId("");
    setLastReading(null);
  }, [searchUnitId]);

  return (
    <div className="bg-gray-100 p-6 text-gray-800 rounded-lg w-full">
      <h1 className="text-2xl font-bold text-center">HydroSense Monitor</h1>
      <div className="mx-auto gap-4 py-4">
        {/* Left Column: Controls */}
        <div className="max-w-2xl mx-auto flex flex-col justify-center items-center gap-4 ">
          <div className="w-full flex flex-row justify-center gap-2">
            <input
              type="text"
              value={searchUnitId}
              onChange={(e) => setSearchUnitId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Enter Unit ID (such as unit-123)"
              className="w-[400px] px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleSearch}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded shadow cursor-pointer"
            >
              Search
            </button>
          </div>

          <button
            onClick={sendRandomReading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded shadow cursor-pointer"
          >
            Send Random Reading
          </button>
        </div>

        {/* Right Column: Results */}
        <div
          className={`flex flex-row gap-4 mt-4 transition-all duration-500 ease-in-out ${
            activeUnitId
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {activeUnitId && (
            <>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Alert Table</h2>
                {loading ? (
                  <p className="text-blue-600">Loading alerts...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <AlertTable alerts={alerts} />
                )}
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Sensor Trends</h2>
                {alerts.length > 0 ? (
                  <SensorLineChart alerts={alerts} />
                ) : (
                  <p className="text-gray-500 text-sm">
                    No alerts available for this unit.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showPopup && lastReading && (
        <RandomReadingPopup
          alert={lastReading}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default App;
