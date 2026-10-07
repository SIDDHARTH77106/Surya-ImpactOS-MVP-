export type ProjectKey = "government" | "jeevanDhara";

export type OutageWindow = {
  startHour: number;
  endHour: number;
};

export type BackupStatus = "Not in use" | "Battery supporting during outage";

export type ProjectConfig = {
  name: string;
  location: string;
  capacityKw: number;
  outageWindows: OutageWindow[];
  batteryStatus: Exclude<BackupStatus, "Not in use">;
  /** Location-specific demo adjustment; 1.0 retains the shared baseline, not live weather. */
  solarResourceMultiplier: number;
};

export type ScheduleInterval = {
  hour: number;
  label: string;
  generationKwh: number;
  gridStatus: "available" | "outage";
  backupStatus: BackupStatus;
};

export const SIMULATION_ASSUMPTIONS = {
  defaultDate: "2026-10-15",
  performanceRatio: 0.8,
  defaultPeakSunHours: 4.5,
  /** Configurable demo estimates by month; October is the requested 4.5 PSH baseline. */
  peakSunHoursByMonth: [4.1, 4.5, 5.1, 5.5, 5.7, 5.2, 4.4, 4.3, 4.4, 4.5, 4.3, 4.0],
  co2KgPerKwh: 0.82,
} as const;

export const PROJECTS: Record<ProjectKey, ProjectConfig> = {
  government: {
    name: "Govt. Primary School Surana",
    location: "Surana, Haryana",
    capacityKw: 5,
    outageWindows: [{ startHour: 11, endHour: 13 }],
    batteryStatus: "Battery supporting during outage",
    solarResourceMultiplier: 1,
  },
  jeevanDhara: {
    name: "Jeevan Dhara Welfare Society",
    location: "Ghaziabad, Uttar Pradesh",
    capacityKw: 6,
    outageWindows: [{ startHour: 14, endHour: 17 }],
    batteryStatus: "Battery supporting during outage",
    solarResourceMultiplier: 1,
  },
};

const daylightWeights = Array.from({ length: 12 }, (_, index) => Math.sin((Math.PI * (index + 0.5)) / 12));
const daylightWeightTotal = daylightWeights.reduce((total, weight) => total + weight, 0);

function roundToTwo(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function hourLabel(hour: number) {
  const format = (value: number) => `${String(value).padStart(2, "0")}:00`;
  return `${format(hour)}–${format((hour + 1) % 24)}`;
}

export function getPeakSunHours(date: string | Date) {
  const parsedDate = typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
  return SIMULATION_ASSUMPTIONS.peakSunHoursByMonth[parsedDate.getMonth()] ?? SIMULATION_ASSUMPTIONS.defaultPeakSunHours;
}

export function getProjectPeakSunHours(projectKey: ProjectKey, date: string | Date) {
  return getPeakSunHours(date) * PROJECTS[projectKey].solarResourceMultiplier;
}

export function getEstimatedDailyGeneration(projectKey: ProjectKey, date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate) {
  const project = PROJECTS[projectKey];
  return roundToTwo(project.capacityKw * getProjectPeakSunHours(projectKey, date) * SIMULATION_ASSUMPTIONS.performanceRatio);
}

export function getDaysInMonth(date: string | Date) {
  const parsedDate = typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
  return new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0).getDate();
}

/** Sums the deterministic daily schedules for every day in the selected month. */
export function getMonthlyGenerationTotal(projectKey: ProjectKey, date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate) {
  const parsedDate = typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth();
  const daysInMonth = getDaysInMonth(parsedDate);
  let total = 0;

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayDate = new Date(year, month, day, 12);
    total += createDailySchedule(projectKey, dayDate).reduce((sum, interval) => sum + interval.generationKwh, 0);
  }

  return roundToTwo(total);
}

export function getPortfolioMonthlyGenerationTotal(date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate) {
  return roundToTwo((Object.keys(PROJECTS) as ProjectKey[]).reduce(
    (total, projectKey) => total + getMonthlyGenerationTotal(projectKey, date),
    0,
  ));
}

/**
 * Creates a deterministic 24-hour, hourly schedule. Generation is allocated using
 * a normalized bell-shaped daylight curve and the final rounding remainder is placed
 * in the noon interval so its sum always equals the estimated daily total.
 */
export function createDailySchedule(projectKey: ProjectKey, date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate): ScheduleInterval[] {
  const project = PROJECTS[projectKey];
  const estimatedTotal = getEstimatedDailyGeneration(projectKey, date);
  const daylightGeneration = daylightWeights.map((weight) => roundToTwo((estimatedTotal * weight) / daylightWeightTotal));
  const roundedDifference = roundToTwo(estimatedTotal - daylightGeneration.reduce((total, value) => total + value, 0));
  daylightGeneration[5] = roundToTwo(daylightGeneration[5] + roundedDifference);

  return Array.from({ length: 24 }, (_, hour) => {
    const outage = project.outageWindows.some(({ startHour, endHour }) => hour >= startHour && hour < endHour);
    const daylightIndex = hour - 6;

    return {
      hour,
      label: hourLabel(hour),
      generationKwh: daylightIndex >= 0 && daylightIndex < daylightGeneration.length ? daylightGeneration[daylightIndex] : 0,
      gridStatus: outage ? "outage" : "available",
      backupStatus: outage ? project.batteryStatus : "Not in use",
    };
  });
}

export function getGeneratedSoFar(schedule: ScheduleInterval[], simulatedMinutes: number) {
  const completedIntervals = Math.floor(Math.max(0, Math.min(1440, simulatedMinutes)) / 60);
  return roundToTwo(schedule.slice(0, completedIntervals).reduce((total, interval) => total + interval.generationKwh, 0));
}

export function getOutageDurationHours(projectKey: ProjectKey) {
  return PROJECTS[projectKey].outageWindows.reduce((total, window) => total + window.endHour - window.startHour, 0);
}

export function formatSimulatedTime(minutes: number) {
  const safeMinutes = Math.max(0, Math.min(1440, minutes));
  const hour = Math.floor(safeMinutes / 60);
  const minute = safeMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
