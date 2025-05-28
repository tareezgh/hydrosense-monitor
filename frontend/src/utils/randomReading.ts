const getRandomUnitId = (): string => {
  const prefix = "unit-";
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${number}`;
};

export const generateRandomReading = (unitId?: string) => {
  return {
    unitId: unitId ?? getRandomUnitId(),
    timestamp: new Date().toISOString(),
    readings: {
      pH: parseFloat((Math.random() * 14).toFixed(2)), // 0.00 – 14.00
      temp: parseFloat((Math.random() * 25 + 10).toFixed(1)), // 10.0 – 35.0
      ec: parseFloat((Math.random() * 2.8 + 0.2).toFixed(2)), // 0.2 – 3.0
    },
  };
};
