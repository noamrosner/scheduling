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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { User, EmailType, ScheduleFrequency, DayOfWeek } from "@/types/types";
import moment from "moment-timezone";

interface UsersSectionProps {
  users: User[];
  onCreateUser: (
    email: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => Promise<void>;
  onUpdateUser: (
    id: string,
    email: string,
    timezone: string,
    preferredTime: string,
    emailType: EmailType,
    frequency: ScheduleFrequency,
    dayOfWeek?: DayOfWeek
  ) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}
const tzOptions = moment.tz.names().map((tz) => ({
  label: tz,
  value: tz,
}));

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

export default function UsersSection({
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
}: UsersSectionProps) {
  // Create form state
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [preferredTime, setPreferredTime] = useState("09:00");
  const [emailType, setEmailType] = useState<EmailType>("daily-summary");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("daily");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("Monday");

  // Edit form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editTimezone, setEditTimezone] = useState("");
  const [editPreferredTime, setEditPreferredTime] = useState("09:00");
  const [editEmailType, setEditEmailType] =
    useState<EmailType>("daily-summary");
  const [editFrequency, setEditFrequency] =
    useState<ScheduleFrequency>("daily");
  const [editDayOfWeek, setEditDayOfWeek] = useState<DayOfWeek>("Monday");

  const isCreateDisabled =
    !email.trim() ||
    !timezone ||
    !preferredTime ||
    !emailType ||
    !frequency ||
    (frequency === "weekly" && !dayOfWeek);

  const isSaveDisabled =
    !editEmail.trim() ||
    !editTimezone ||
    !editPreferredTime ||
    !editEmailType ||
    !editFrequency ||
    (editFrequency === "weekly" && !editDayOfWeek);

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
    setTimezone("");
    setPreferredTime("09:00");
    setEmailType("daily-summary");
    setFrequency("daily");
    setDayOfWeek("Monday");
  };

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditEmail(u.email);
    setEditTimezone(u.timezone);
    setEditPreferredTime(u.preferredTime);
    setEditEmailType(u.emailType);
    setEditFrequency(u.frequency);
    setEditDayOfWeek(u.dayOfWeek ?? "Monday");
  };

  const handleSave = async () => {
    if (!editingId || isSaveDisabled) return;
    await onUpdateUser(
      editingId,
      editEmail,
      editTimezone,
      editPreferredTime,
      editEmailType,
      editFrequency,
      editFrequency === "weekly" ? editDayOfWeek : undefined
    );
    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
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
          <div className="flex flex-col gap-2">
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
          </div>

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

        {/* Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Email Type</TableHead>
              <TableHead>Freq</TableHead>
              <TableHead>Day</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                {editingId === u.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editTimezone}
                        onValueChange={setEditTimezone}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tzOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={editPreferredTime}
                        onChange={(e) => setEditPreferredTime(e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editEmailType}
                        onValueChange={(v) => setEditEmailType(v as EmailType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {emailTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={editFrequency}
                        onValueChange={(v) =>
                          setEditFrequency(v as ScheduleFrequency)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {editFrequency === "weekly" ? (
                        <Select
                          value={editDayOfWeek}
                          onValueChange={(v) =>
                            setEditDayOfWeek(v as DayOfWeek)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.timezone}</TableCell>
                    <TableCell>{u.preferredTime}</TableCell>
                    <TableCell>
                      {emailTypeOptions.find((opt) => opt.value === u.emailType)
                        ?.label ?? u.emailType}
                    </TableCell>
                    <TableCell>
                      {frequencyOptions.find((opt) => opt.value === u.frequency)
                        ?.label ?? u.frequency}
                    </TableCell>
                    <TableCell>
                      {u.frequency === "weekly" ? u.dayOfWeek : "—"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => startEdit(u)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteUser(u.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
