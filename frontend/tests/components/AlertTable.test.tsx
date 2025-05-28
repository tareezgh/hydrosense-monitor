import { render, screen } from "@testing-library/react";
import AlertTable from "../../src/components/AlertTable";
import type { Alert } from "../../src/types/sensor";
import { describe, test, expect } from "@jest/globals";
import "@testing-library/jest-dom";

describe("AlertTable", () => {
  const mockAlerts: Alert[] = [
    {
      timestamp: new Date("2025-05-25T12:00:00Z"),
      readings: { pH: 7.2, temp: 23.5, ec: 1.4 },
      classification: "Needs Attention",
    },
    {
      timestamp: new Date("2025-05-25T13:00:00Z"),
      readings: { pH: 5.9, temp: 26.0, ec: 2.1 },
      classification: "Healthy",
    },
  ];

  test("renders table with alerts", () => {
    render(<AlertTable alerts={mockAlerts} />);

    expect(screen.getByText(/Timestamp/i)).toBeDefined();
    expect(screen.getByText(/PH/i)).toBeDefined();
    expect(screen.getByText(/TEMP/i)).toBeDefined();
    expect(screen.getByText(/EC/i)).toBeDefined();
    expect(screen.getByText(/Classification/i)).toBeDefined();

    expect(screen.getAllByRole("row")).toHaveLength(mockAlerts.length + 1); // +1 for header row

    expect(screen.getByText("Healthy")).toBeDefined();
    expect(screen.getByText("Needs Attention")).toBeDefined();
  });

  test("check colors logic based on classification", () => {
    render(<AlertTable alerts={mockAlerts} />);

    // "Needs Attention" → bg-red-300
    // "Healthy" → bg-green-300

    // @ts-expect-error: toHaveClass is provided by jest-dom
    expect(screen.getByTestId("alert-row-needs-attention")).toHaveClass(
      "bg-red-300"
    );
    // @ts-expect-error: toHaveClass is provided by jest-dom
    expect(screen.getByTestId("alert-row-healthy")).toHaveClass("bg-green-300");
  });

  test("renders empty message if no alerts", () => {
    render(<AlertTable alerts={[]} />);
    expect(
      screen.getByText(/No alerts available for this unit./i)
    ).toBeDefined();
  });
});
