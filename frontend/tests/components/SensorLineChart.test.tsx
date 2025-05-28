import { render, screen } from "@testing-library/react";
import SensorLineChart from "../../src/components/SensorLineChart";
import type { Alert } from "../../src/types/sensor";
import { describe, test, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import type { ChartData, ChartOptions } from "chart.js";

jest.mock("react-chartjs-2", () => ({
  __esModule: true,
  Line: (props: { data: ChartData<"line">; options: ChartOptions<"line"> }) => {
    const { data } = props;
    return (
      <div data-testid="mock-line-chart">
        {data.datasets.map((dataset) => (
          <div key={dataset.label}>{dataset.label}</div>
        ))}
      </div>
    );
  },
}));

const mockAlerts: Alert[] = [
  {
    timestamp: new Date("2025-05-25T12:00:00Z"),
    readings: { pH: 7.5, temp: 23.5, ec: 1.4 },
    classification: "Needs Attention",
  },
  {
    timestamp: new Date("2025-05-25T13:00:00Z"),
    readings: { pH: 6.2, temp: 24.0, ec: 2.3 },
    classification: "Healthy",
  },
];

describe("SensorLineChart", () => {
  test("renders health timeline with correct colors", () => {
    render(<SensorLineChart alerts={mockAlerts} />);
    const redDot = screen.getByTestId("timeline-dot-red");
    const greenDot = screen.getByTestId("timeline-dot-green");

    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(redDot).toBeInTheDocument();
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(greenDot).toBeInTheDocument();
  });

  test("renders alert summary for mixed classification", () => {
    render(<SensorLineChart alerts={mockAlerts} />);
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(screen.getByText(/alert\(s\) in last readings/i)).toBeInTheDocument();
  });

  test("renders all-good summary if all alerts are healthy", () => {
    const healthyAlerts = mockAlerts.map((alert) => ({
      ...alert,
      classification: "Healthy" as const,
    }));
    render(<SensorLineChart alerts={healthyAlerts} />);
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(screen.getByText(/All readings look good/i)).toBeInTheDocument();
  });

  test("renders mocked chart with correct metric labels", () => {
    render(<SensorLineChart alerts={mockAlerts} />);
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(screen.getByTestId("mock-line-chart")).toBeInTheDocument();
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(screen.getByText("pH")).toBeInTheDocument();
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(screen.getByText("Temp (°C)")).toBeInTheDocument();
    // @ts-expect-error: toBeInTheDocument is provided by jest-dom
    expect(screen.getByText("EC")).toBeInTheDocument();
  });
});
