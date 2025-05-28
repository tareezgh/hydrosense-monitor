import { API_URL } from "./constants";
import type { SensorRequest, SensorResponse } from "../types/sensor";

export const postSensorReading = async (
  payload: SensorRequest
): Promise<SensorResponse> => {
  const res = await fetch(`${API_URL}/sensor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send sensor reading");
  }

  return await res.json();
};

export const getAlertsByUnitId = async (unitId: string) => {
  const res = await fetch(`${API_URL}/alerts?unitId=${unitId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return await res.json();
};
