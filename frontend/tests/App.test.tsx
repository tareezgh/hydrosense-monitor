import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { jest, describe, test, expect } from "@jest/globals";
import * as sensorApi from "../src/api/sensorApi";
import * as useAlertsHook from "../src/hooks/useAlerts";
import "@testing-library/jest-dom";
import App from "../src/App";
import { Alert } from "../src/types/sensor";

jest.mock("../src/api/sensorApi");
jest.mock("../src/hooks/useAlerts");

const mockAlerts: Alert[] = [
  {
    timestamp: new Date(),
    classification: "Healthy",
    readings: {
      pH: 7,
      temp: 22.5,
      ec: 1.2,
    },
  },
];

describe("App component", () => {
  test("clicking send button triggers postSensorReading", async () => {
    const postSensorMock = jest
      .spyOn(sensorApi, "postSensorReading")
      .mockResolvedValue({
        status: "OK",
        classification: "Healthy",
      });

    const setAlertsMock = jest.fn();
    const fetchAlertsMock = jest.fn(() => Promise.resolve(mockAlerts));

    jest.spyOn(useAlertsHook, "useAlerts").mockReturnValue({
      alerts: [],
      setAlerts: setAlertsMock,
      loading: false,
      error: null,
      fetchAlerts: fetchAlertsMock,
    });

    render(<App />);

    const sendButton = screen.getByText(/Send Random Reading/i);
    await userEvent.click(sendButton);

    expect(postSensorMock).toHaveBeenCalled();
  });
});
