"use client";

import { useState, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EmailType, ScheduleFrequency, DayOfWeek } from "@/types/types";
import moment from "moment-timezone";

interface SingleAddUserSectionProps {
  onCreateUser: (
    email: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => Promise<void>;
}
const emailTypeOptions: { label: string; value: EmailType }[] = [
  { label: "Daily Summary", value: "daily-summary" },
  { label: "Weekly Report", value: "weekly-report" },
  { label: "Activity Alert", value: "activity-alert" },
  { label: "Promo", value: "promo" },
  { label: "System Reminder", value: "system-reminder" },
];

const frequencyOptions: { label: string; value: ScheduleFrequency }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

const daysOfWeek: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function SingleAddUserSection({
  onCreateUser,
}: SingleAddUserSectionProps) {
  // Create form state
  const [email, setEmail] = useState("");
  const [preferredTime, setPreferredTime] = useState("09:00");
  const [emailType, setEmailType] = useState<EmailType>("daily-summary");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("daily");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("Monday");

  const timezone = moment.tz.guess();

  const isCreateDisabled =
    !email.trim() ||
    !timezone ||
    !preferredTime ||
    !emailType ||
    !frequency ||
    (frequency === "weekly" && !dayOfWeek);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (isCreateDisabled) return;
    await onCreateUser(
      email,
      timezone,
      preferredTime,
      emailType,
      frequency,
      frequency === "weekly" ? dayOfWeek : undefined
    );
    setEmail("");
    setPreferredTime("09:00");
    setEmailType("daily-summary");
    setFrequency("daily");
    setDayOfWeek("Monday");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add User</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Form */}
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 items-end"
        >
          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Timezone */}
          {/* <div className="flex flex-col gap-2">
            <Label htmlFor="new-tz">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                {tzOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Preferred Time */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-time">Time</Label>
            <Input
              id="new-time"
              type="time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>

          {/* Email Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-type">Email Type</Label>
            <Select
              value={emailType}
              onValueChange={(v) => setEmailType(v as EmailType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {emailTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-frequency">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as ScheduleFrequency)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Freq" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day of Week (only if weekly) */}
          {frequency === "weekly" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-day">Day</Label>
              <Select
                value={dayOfWeek}
                onValueChange={(v) => setDayOfWeek(v as DayOfWeek)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" disabled={isCreateDisabled}>
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
