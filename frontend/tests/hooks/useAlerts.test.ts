import { renderHook, act, waitFor } from "@testing-library/react";
import { useAlerts } from "../../src/hooks/useAlerts";
import { getAlertsByUnitId } from "../../src/api/sensorApi";
import type { Alert } from "../../src/types/sensor";

jest.mock("../../src/api/sensorApi");

const mockAlerts: Alert[] = [
  {
    timestamp: new Date(),
    classification: "Healthy",
    readings: {
      pH: 6,
      temp: 22.5,
      ec: 1.2,
    },
  },
];

describe("useAlerts hook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchAlerts sets alerts and loading states", async () => {
    (getAlertsByUnitId as jest.Mock).mockResolvedValue(mockAlerts);

    const { result } = renderHook(() => useAlerts());

    await act(async () => {
      await result.current.fetchAlerts("unit-123");
    });

    await waitFor(() => {
      expect(getAlertsByUnitId).toHaveBeenCalledWith("unit-123");
      expect(result.current.loading).toBe(false);
      expect(result.current.alerts).toEqual(mockAlerts);
    });
  });

  test("fetchAlerts handles errors properly", async () => {
    const errorMessage = "Failed to fetch";
    (getAlertsByUnitId as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAlerts());

    await act(async () => {
      await result.current.fetchAlerts("unit-err");
    });

    await waitFor(() => {
      expect(getAlertsByUnitId).toHaveBeenCalledWith("unit-err");
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
      expect(result.current.alerts).toEqual([]);
    });
  });
});
