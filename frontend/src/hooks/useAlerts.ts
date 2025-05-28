import { useState } from "react";
import type { Alert } from "../types/sensor";
import { getAlertsByUnitId } from "../api/sensorApi";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async (unitId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlertsByUnitId(unitId);
      setAlerts(data);
      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error while fetching alerts");
      }
    } finally {
      setLoading(false);
    }
  };

  return { alerts, setAlerts, loading, error, fetchAlerts };
}
