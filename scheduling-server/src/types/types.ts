export type EmailType =
  | "daily-summary"
  | "weekly-report"
  | "activity-alert"
  | "promo"
  | "system-reminder";

export type ScheduleFrequency = "daily" | "weekly";
export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface User {
  id: string;
  email: string;
  timezone: string;
  preferredTime: string; // "HH:mm"
  emailType: EmailType;
  frequency: ScheduleFrequency;
  dayOfWeek?: DayOfWeek; // only when frequency==='weekly'
}
export interface Group {
  id: string;
  name: string;
  members: string[];
  timezone: string;
  preferredTime: string; // "HH:mm"
  emailType: EmailType;
  frequency: ScheduleFrequency;
  dayOfWeek?: DayOfWeek; // only when frequency==='weekly'
}
