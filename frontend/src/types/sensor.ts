type Classification = "Healthy" | "Needs Attention";

export interface Reading {
  pH: number;
  temp: number;
  ec: number;
}

export interface Alert {
  timestamp: Date;
  classification: Classification;
  readings: Reading;
}

export interface FullAlert extends Alert {
  unitId: string;
}

export interface SensorRequest {
  unitId: string;
  timestamp: string;
  readings: Reading;
}

export interface SensorResponse {
  status: "OK";
  classification: Classification;
}
