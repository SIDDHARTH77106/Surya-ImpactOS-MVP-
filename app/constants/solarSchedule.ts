export type ProjectKey = "government" | "jeevanDhara";
export type BackupStatus = "Not in use" | "Battery supporting during outage";

type OutageWindow = { startHour: number; endHour: number };
type AssessmentForecast = {
  coordinates: string;
  reportCapacityKw: number;
  annualForecastKwh: number;
  profilePeakKwAtReportCapacity: number;
  profilePeakTime: string;
  monthlyForecastKwhAtReportCapacity: readonly number[];
};

export type ProjectConfig = {
  name: string;
  location: string;
  capacityKw: number;
  outageWindows: OutageWindow[];
  batteryStatus: Exclude<BackupStatus, "Not in use">;
  assessment: AssessmentForecast;
};

export type ScheduleInterval = {
  startMinutes: number;
  endMinutes: number;
  label: string;
  generationKwh: number;
  gridStatus: "available" | "outage";
  backupStatus: BackupStatus;
};

export const SIMULATION_ASSUMPTIONS = {
  defaultDate: "2026-10-15",
  timeZone: "Asia/Kolkata",
  intervalMinutes: 30,
  daylightStartMinutes: 6 * 60 + 30,
  daylightEndMinutes: 18 * 60 + 30,
  /** Assessment profiles are normalized to each selected month's report-based daily forecast. */
  profileDescription: "Estimated 30-minute profile normalized from the supplied pre-installation solar assessment",
} as const;

export const PROJECTS: Record<ProjectKey, ProjectConfig> = {
  government: {
    name: "Govt. Primary School Surana",
    location: "Surana, Haryana",
    capacityKw: 5,
    outageWindows: [{ startHour: 11, endHour: 13 }],
    batteryStatus: "Battery supporting during outage",
    assessment: {
      coordinates: "28.0812° N, 76.1600° E",
      reportCapacityKw: 5,
      annualForecastKwh: 7062.6,
      profilePeakKwAtReportCapacity: 2.68,
      profilePeakTime: "12:30",
      monthlyForecastKwhAtReportCapacity: [376.7, 478.5, 684.8, 772, 815.7, 717.3, 632.8, 615.9, 610.6, 568.2, 421, 369.1],
    },
  },
  jeevanDhara: {
    name: "Jeevan Dhara Welfare Society",
    location: "Ghaziabad, Uttar Pradesh",
    capacityKw: 6,
    outageWindows: [{ startHour: 14, endHour: 17 }],
    batteryStatus: "Battery supporting during outage",
    assessment: {
      coordinates: "28.6905° N, 77.4048° E",
      reportCapacityKw: 5,
      annualForecastKwh: 6961.6,
      profilePeakKwAtReportCapacity: 2.64,
      profilePeakTime: "12:00",
      monthlyForecastKwhAtReportCapacity: [373.6, 474.7, 683, 770, 811.5, 712.1, 605.4, 590.6, 591.8, 564, 418.9, 366.2],
    },
  },
};

const reportMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daylightIntervals = (SIMULATION_ASSUMPTIONS.daylightEndMinutes - SIMULATION_ASSUMPTIONS.daylightStartMinutes) / SIMULATION_ASSUMPTIONS.intervalMinutes;
// Calibrated to keep the October assessment peaks close to the supplied
// 2.68 kW (Surana) and scaled 3.17 kW (Jeevan Dhara) profile peaks.
const daylightWeights = Array.from({ length: daylightIntervals }, (_, index) => Math.sin((Math.PI * (index + 0.1)) / daylightIntervals) ** 1.35);
const daylightWeightTotal = daylightWeights.reduce((sum, weight) => sum + weight, 0);

function roundToTwo(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseDate(date: string | Date) {
  return typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
}

function timeLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getDaysInMonth(date: string | Date) {
  const parsedDate = parseDate(date);
  return new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0).getDate();
}

export function getCapacityScaling(projectKey: ProjectKey) {
  const project = PROJECTS[projectKey];
  return project.capacityKw / project.assessment.reportCapacityKw;
}

export function getEstimatedDailyGeneration(projectKey: ProjectKey, date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate) {
  const parsedDate = parseDate(date);
  const project = PROJECTS[projectKey];
  const reportMonthlyTotal = project.assessment.monthlyForecastKwhAtReportCapacity[parsedDate.getMonth()];
  const dailyAtReportCapacity = reportMonthlyTotal / reportMonthDays[parsedDate.getMonth()];
  return roundToTwo(dailyAtReportCapacity * getCapacityScaling(projectKey));
}

export function getMonthlyGenerationTotal(projectKey: ProjectKey, date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate) {
  const parsedDate = parseDate(date);
  const project = PROJECTS[projectKey];
  const monthIndex = parsedDate.getMonth();
  const reportMonthTotal = project.assessment.monthlyForecastKwhAtReportCapacity[monthIndex];

  // Preserve the report's monthly forecast for its reference calendar, while
  // applying the same daily estimate to an alternate calendar such as leap February.
  return roundToTwo(
    (reportMonthTotal / reportMonthDays[monthIndex]) *
      getCapacityScaling(projectKey) *
      getDaysInMonth(parsedDate),
  );
}

export function getPortfolioMonthlyGenerationTotal(date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate) {
  return roundToTwo((Object.keys(PROJECTS) as ProjectKey[]).reduce((total, projectKey) => total + getMonthlyGenerationTotal(projectKey, date), 0));
}

export function getForecastAssumptionNote(projectKey: ProjectKey) {
  const project = PROJECTS[projectKey];
  const scaling = getCapacityScaling(projectKey);
  const capacityNote = scaling === 1
    ? `Assessment forecast at the installed ${project.capacityKw} kW capacity.`
    : `Assessment forecast proportionally scaled from ${project.assessment.reportCapacityKw} kWp to the installed ${project.capacityKw} kW capacity (×${scaling.toFixed(1)}); not measured output.`;
  const typicalPeakKw = project.assessment.profilePeakKwAtReportCapacity * scaling;

  return `${capacityNote} Report profile peaks near ${project.assessment.profilePeakTime} at about ${typicalPeakKw.toFixed(2)} kW; ${SIMULATION_ASSUMPTIONS.profileDescription.toLowerCase()}.`;
}

/** Creates a deterministic 48-interval estimated day from the supplied solar assessment profile. */
export function createDailySchedule(projectKey: ProjectKey, date: string | Date = SIMULATION_ASSUMPTIONS.defaultDate): ScheduleInterval[] {
  const project = PROJECTS[projectKey];
  const dailyForecast = getEstimatedDailyGeneration(projectKey, date);
  const daylightGeneration = daylightWeights.map((weight) => roundToTwo((dailyForecast * weight) / daylightWeightTotal));
  const roundingDifference = roundToTwo(dailyForecast - daylightGeneration.reduce((sum, value) => sum + value, 0));
  const midpoint = Math.floor(daylightGeneration.length / 2);
  daylightGeneration[midpoint] = roundToTwo(daylightGeneration[midpoint] + roundingDifference);

  return Array.from({ length: 24 * 60 / SIMULATION_ASSUMPTIONS.intervalMinutes }, (_, index) => {
    const startMinutes = index * SIMULATION_ASSUMPTIONS.intervalMinutes;
    const endMinutes = startMinutes + SIMULATION_ASSUMPTIONS.intervalMinutes;
    const daylightIndex = (startMinutes - SIMULATION_ASSUMPTIONS.daylightStartMinutes) / SIMULATION_ASSUMPTIONS.intervalMinutes;
    const outage = project.outageWindows.some(({ startHour, endHour }) => startMinutes >= startHour * 60 && startMinutes < endHour * 60);
    return {
      startMinutes,
      endMinutes,
      label: `${timeLabel(startMinutes)}–${timeLabel(endMinutes)}`,
      generationKwh: Number.isInteger(daylightIndex) && daylightIndex >= 0 && daylightIndex < daylightGeneration.length ? daylightGeneration[daylightIndex] : 0,
      gridStatus: outage ? "outage" : "available",
      backupStatus: outage ? project.batteryStatus : "Not in use",
    };
  });
}

export function getEstimatedGenerationSoFar(schedule: ScheduleInterval[], simulatedMinutes: number) {
  return roundToTwo(schedule.filter((interval) => interval.endMinutes <= Math.max(0, Math.min(1440, simulatedMinutes))).reduce((sum, interval) => sum + interval.generationKwh, 0));
}

/** Backward-compatible alias retained for existing consumers. */
export const getGeneratedSoFar = getEstimatedGenerationSoFar;

export function getOutageDurationHours(projectKey: ProjectKey) {
  return PROJECTS[projectKey].outageWindows.reduce((total, window) => total + window.endHour - window.startHour, 0);
}

export function formatSimulatedTime(minutes: number) {
  return timeLabel(Math.max(0, Math.min(1440, minutes)));
}
